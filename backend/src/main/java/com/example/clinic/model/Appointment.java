package com.example.clinic.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDateTime;

// The "action / transaction" entity required by the brief - links a User (patient)
// to a ClinicService at a specific date/time.
@Document(collection = "appointments")
public class Appointment {

    @Id
    private String id;

    // Indexed: needed for "view own records" (find by patientId) and reports (group by serviceId)
    @Indexed
    private String patientId;
    private String patientName;

    @Indexed
    private String serviceId;
    private String serviceName;

    // Indexed: used for the double-booking check (same service + same time)
    // and for filtering/sorting appointment lists by date.
    @Indexed
    private LocalDateTime appointmentDateTime;

    // PENDING -> CONFIRMED (by admin) or CANCELLED (by patient or admin)
    @Indexed
    private String status;

    private String notes;
    private Instant createdAt;

    public Appointment() {
    }

    public Appointment(String patientId, String patientName, String serviceId, String serviceName,
                        LocalDateTime appointmentDateTime, String status, String notes) {
        this.patientId = patientId;
        this.patientName = patientName;
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.appointmentDateTime = appointmentDateTime;
        this.status = status;
        this.notes = notes;
        this.createdAt = Instant.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getServiceId() {
        return serviceId;
    }

    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public LocalDateTime getAppointmentDateTime() {
        return appointmentDateTime;
    }

    public void setAppointmentDateTime(LocalDateTime appointmentDateTime) {
        this.appointmentDateTime = appointmentDateTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
