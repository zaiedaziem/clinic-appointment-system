package com.example.clinic.repository;

import com.example.clinic.model.Appointment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends MongoRepository<Appointment, String> {

    // "My Records" page for patients
    List<Appointment> findByPatientId(String patientId);

    // Double-booking check: is there already a non-cancelled appointment
    // for this exact service at this exact date/time?
    boolean existsByServiceIdAndAppointmentDateTimeAndStatusNot(
            String serviceId, LocalDateTime appointmentDateTime, String status);
}
