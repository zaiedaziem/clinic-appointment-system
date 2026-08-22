package com.example.clinic.repository;

import com.example.clinic.model.Appointment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;

public interface AppointmentRepository extends MongoRepository<Appointment, String> {

    // "My Records" page for patients - paginated
    Page<Appointment> findByPatientId(String patientId, Pageable pageable);

    // Admin's "All Appointments" list, optionally filtered by status - paginated
    Page<Appointment> findByStatus(String status, Pageable pageable);

    // Double-booking check: is there already a non-cancelled appointment
    // for this exact service at this exact date/time?
    boolean existsByServiceIdAndAppointmentDateTimeAndStatusNot(
            String serviceId, LocalDateTime appointmentDateTime, String status);
}
