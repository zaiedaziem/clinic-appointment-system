package com.example.clinic.service;

import com.example.clinic.dto.CreateServiceRequest;
import com.example.clinic.dto.ServiceResponse;
import com.example.clinic.dto.UpdateServiceRequest;
import com.example.clinic.exception.ResourceNotFoundException;
import com.example.clinic.model.ClinicService;
import com.example.clinic.repository.ClinicServiceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

// Business logic layer for the "services" main entity (Admin Requirements 1-5).
@Service
public class ServiceCatalogService {

    private final ClinicServiceRepository clinicServiceRepository;

    public ServiceCatalogService(ClinicServiceRepository clinicServiceRepository) {
        this.clinicServiceRepository = clinicServiceRepository;
    }

    public List<ServiceResponse> listAll() {
        return clinicServiceRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
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
