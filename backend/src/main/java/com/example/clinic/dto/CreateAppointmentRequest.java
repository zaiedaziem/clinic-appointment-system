package com.example.clinic.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

// What a patient sends to book an appointment.
// patientId/patientName are NOT here - they come from the logged-in user's
// JWT, never trusted from client input (a patient could otherwise book "as" someone else).
public class CreateAppointmentRequest {

    @NotBlank(message = "Service ID is required")
    private String serviceId;

    @NotNull(message = "Appointment date/time is required")
    @Future(message = "Appointment date/time must be in the future")
    private LocalDateTime appointmentDateTime;

    private String notes;

    public String getServiceId() {
        return serviceId;
    }

    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }

    public LocalDateTime getAppointmentDateTime() {
        return appointmentDateTime;
    }

    public void setAppointmentDateTime(LocalDateTime appointmentDateTime) {
        this.appointmentDateTime = appointmentDateTime;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
