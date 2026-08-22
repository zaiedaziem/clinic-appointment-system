package com.example.clinic.service;

import com.example.clinic.dto.AppointmentResponse;
import com.example.clinic.dto.CreateAppointmentRequest;
import com.example.clinic.dto.PagedResponse;
import com.example.clinic.dto.UpdateAppointmentStatusRequest;
import com.example.clinic.exception.BusinessRuleViolationException;
import com.example.clinic.exception.ResourceNotFoundException;
import com.example.clinic.model.Appointment;
import com.example.clinic.model.AppointmentStatus;
import com.example.clinic.model.ClinicService;
import com.example.clinic.repository.AppointmentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

// Business logic for the "appointments" action/transaction entity.
// This is where the domain's core business rules live (Section 9.4 of the brief).
@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    // Reusing ServiceCatalogService's package-private findEntityById() instead of
    // injecting ClinicServiceRepository directly - keeps "is this service valid?"
    // logic in one place.
    private final ServiceCatalogService serviceCatalogService;

    public AppointmentService(AppointmentRepository appointmentRepository, ServiceCatalogService serviceCatalogService) {
        this.appointmentRepository = appointmentRepository;
        this.serviceCatalogService = serviceCatalogService;
    }

    public AppointmentResponse create(CreateAppointmentRequest request, String patientId, String patientName) {
        ClinicService service = serviceCatalogService.findEntityById(request.getServiceId());

        // Business rule: cannot book an inactive service
        if (!service.isActive()) {
            throw new BusinessRuleViolationException("This service is not currently available for booking");
        }

        // Business rule: cannot book in the past (also enforced by @Future on the DTO,
        // this is a defence-in-depth server-side check)
        if (request.getAppointmentDateTime().isBefore(LocalDateTime.now())) {
            throw new BusinessRuleViolationException("Cannot book an appointment in the past");
        }

        // Business rule: a slot cannot be double-booked. A cancelled appointment
        // does NOT block the slot - this is how "cancelling frees the slot" works.
        boolean slotTaken = appointmentRepository.existsByServiceIdAndAppointmentDateTimeAndStatusNot(
                service.getId(), request.getAppointmentDateTime(), AppointmentStatus.CANCELLED);

        if (slotTaken) {
            throw new BusinessRuleViolationException("This time slot is already booked for this service");
        }

        Appointment appointment = new Appointment(
                patientId,
                patientName,
                service.getId(),
                service.getName(),
                request.getAppointmentDateTime(),
                AppointmentStatus.PENDING,
                request.getNotes()
        );

        return toResponse(appointmentRepository.save(appointment));
    }

    // "My Records" - a patient's own appointments only, newest first, paginated
    public PagedResponse<AppointmentResponse> listOwn(String patientId, int page, int size) {
        Page<Appointment> result = appointmentRepository.findByPatientId(
                patientId, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "appointmentDateTime")));

        return toPagedResponse(result, page, size);
    }

    // Admin: all appointment records, optionally filtered by status, paginated
    public PagedResponse<AppointmentResponse> listAll(String status, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "appointmentDateTime"));

        Page<Appointment> result = (status != null && !status.isBlank())
                ? appointmentRepository.findByStatus(status, pageable)
                : appointmentRepository.findAll(pageable);

        return toPagedResponse(result, page, size);
    }

    private PagedResponse<AppointmentResponse> toPagedResponse(Page<Appointment> result, int page, int size) {
        List<AppointmentResponse> content = result.getContent()
                .stream()
                .map(this::toResponse)
                .toList();

        return new PagedResponse<>(content, page, size, result.getTotalElements(), result.getTotalPages());
    }

    public AppointmentResponse getById(String id, String callerId, boolean isAdmin) {
        Appointment appointment = findEntityById(id);
        assertOwnerOrAdmin(appointment, callerId, isAdmin);
        return toResponse(appointment);
    }

    // A patient can cancel their own appointment; an admin can cancel any.
    public AppointmentResponse cancel(String id, String callerId, boolean isAdmin) {
        Appointment appointment = findEntityById(id);
        assertOwnerOrAdmin(appointment, callerId, isAdmin);

        if (AppointmentStatus.CANCELLED.equals(appointment.getStatus())) {
            throw new BusinessRuleViolationException("Appointment is already cancelled");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        return toResponse(appointmentRepository.save(appointment));
    }

    // Admin only (enforced by SecurityConfig on /api/admin/**) - confirm/update status
    public AppointmentResponse updateStatus(String id, UpdateAppointmentStatusRequest request) {
        Appointment appointment = findEntityById(id);
        appointment.setStatus(request.getStatus());
        return toResponse(appointmentRepository.save(appointment));
    }

    private void assertOwnerOrAdmin(Appointment appointment, String callerId, boolean isAdmin) {
        if (!isAdmin && !appointment.getPatientId().equals(callerId)) {
            throw new AccessDeniedException("You do not have access to this appointment");
        }
    }

    private Appointment findEntityById(String id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + id));
    }

    private AppointmentResponse toResponse(Appointment appointment) {
        return new AppointmentResponse(
                appointment.getId(),
                appointment.getPatientId(),
                appointment.getPatientName(),
                appointment.getServiceId(),
                appointment.getServiceName(),
                appointment.getAppointmentDateTime(),
                appointment.getStatus(),
                appointment.getNotes(),
                appointment.getCreatedAt()
        );
    }
}
