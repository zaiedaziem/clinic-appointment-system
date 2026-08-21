package com.example.clinic.dto;

import java.time.Instant;
import java.time.LocalDateTime;

public class AppointmentResponse {

    private String id;
    private String patientId;
    private String patientName;
    private String serviceId;
    private String serviceName;
    private LocalDateTime appointmentDateTime;
    private String status;
    private String notes;
    private Instant createdAt;

    public AppointmentResponse(String id, String patientId, String patientName, String serviceId,
                                String serviceName, LocalDateTime appointmentDateTime, String status,
                                String notes, Instant createdAt) {
        this.id = id;
        this.patientId = patientId;
        this.patientName = patientName;
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.appointmentDateTime = appointmentDateTime;
        this.status = status;
        this.notes = notes;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public String getPatientId() {
        return patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public String getServiceId() {
        return serviceId;
    }

    public String getServiceName() {
        return serviceName;
    }

    public LocalDateTime getAppointmentDateTime() {
        return appointmentDateTime;
    }

    public String getStatus() {
        return status;
    }

    public String getNotes() {
        return notes;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
