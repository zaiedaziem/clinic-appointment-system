package com.example.clinic.service;

import com.example.clinic.dto.CreateServiceRequest;
import com.example.clinic.dto.PagedResponse;
import com.example.clinic.dto.ServiceResponse;
import com.example.clinic.dto.UpdateServiceRequest;
import com.example.clinic.exception.BusinessRuleViolationException;
import com.example.clinic.exception.ResourceNotFoundException;
import com.example.clinic.model.ClinicService;
import com.example.clinic.repository.ClinicServiceRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

// Business logic layer for the "services" main entity (Admin Requirements 1-5).
@Service
public class ServiceCatalogService {

    // Only these fields can be sorted on - prevents a client passing an
    // arbitrary/invalid field name into the Mongo query via sortBy.
    private static final Set<String> SORTABLE_FIELDS = Set.of("name", "durationMinutes");

    private final ClinicServiceRepository clinicServiceRepository;
    private final MongoTemplate mongoTemplate;

    public ServiceCatalogService(ClinicServiceRepository clinicServiceRepository, MongoTemplate mongoTemplate) {
        this.clinicServiceRepository = clinicServiceRepository;
        this.mongoTemplate = mongoTemplate;
    }

    // Search + filter + sort + pagination, all in one query.
    // Every parameter is optional except page/size (which always have defaults).
    public PagedResponse<ServiceResponse> search(
            String keyword, Boolean active, String sortBy, String direction, int page, int size) {

        List<Criteria> conditions = new ArrayList<>();

        if (keyword != null && !keyword.isBlank()) {
            // Case-insensitive "contains" search on name - the "search by keyword" requirement
            conditions.add(Criteria.where("name").regex(keyword.trim(), "i"));
        }

        if (active != null) {
            // The "filter by at least one field" requirement
            conditions.add(Criteria.where("active").is(active));
        }

        Query query = conditions.isEmpty()
                ? new Query()
                : new Query(new Criteria().andOperator(conditions.toArray(new Criteria[0])));

        // Count matching documents BEFORE paging is applied, so totalElements
        // reflects the full filtered result set, not just this page's size.
        long totalElements = mongoTemplate.count(query, ClinicService.class);

        String safeSortField = SORTABLE_FIELDS.contains(sortBy) ? sortBy : "name";
        Sort.Direction safeDirection = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;

        query.with(Sort.by(safeDirection, safeSortField));
        query.with(PageRequest.of(page, size));

        List<ServiceResponse> content = mongoTemplate.find(query, ClinicService.class)
                .stream()
                .map(this::toResponse)
                .toList();

        int totalPages = (int) Math.ceil((double) totalElements / size);
        return new PagedResponse<>(content, page, size, totalElements, totalPages);
    }

    public ServiceResponse getById(String id) {
        return toResponse(findEntityById(id));
    }

    public ServiceResponse create(CreateServiceRequest request) {
        // New services always start active - only an update can deactivate one
        ClinicService service = new ClinicService(
                request.getName().trim(),
                request.getDescription(),
                request.getDurationMinutes(),
                true
        );

        return toResponse(clinicServiceRepository.save(service));
    }

    public ServiceResponse update(String id, UpdateServiceRequest request) {
        ClinicService service = findEntityById(id);

        service.setName(request.getName().trim());
        service.setDescription(request.getDescription());
        service.setDurationMinutes(request.getDurationMinutes());
        service.setActive(request.isActive());

        return toResponse(clinicServiceRepository.save(service));
    }

    // Soft delete: brief requires "delete OR deactivate" - deactivate is
    // safer because existing Appointments still reference this service's ID.
    public void deactivate(String id) {
        ClinicService service = findEntityById(id);
        service.setActive(false);
        clinicServiceRepository.save(service);
    }

    // Hard delete - only allowed once a service is already inactive, so there's
    // no risk of deleting something still bookable out from under a user mid-flow.
    // Safe even for services with existing appointments, since Appointment stores
    // its own serviceName snapshot rather than looking the service back up.
    public void delete(String id) {
        ClinicService service = findEntityById(id);

        if (service.isActive()) {
            throw new BusinessRuleViolationException("Cannot permanently delete an active service - deactivate it first");
        }

        clinicServiceRepository.deleteById(id);
    }

    // Package-private (not private) so AppointmentService can reuse this same
    // lookup + 404 handling when validating a booking's serviceId.
    ClinicService findEntityById(String id) {
        return clinicServiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found: " + id));
    }

    private ServiceResponse toResponse(ClinicService service) {
        return new ServiceResponse(
                service.getId(),
                service.getName(),
                service.getDescription(),
                service.getDurationMinutes(),
                service.isActive()
        );
    }
}