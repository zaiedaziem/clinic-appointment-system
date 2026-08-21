package com.example.clinic.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

// Named "ClinicService" instead of "Service" to avoid clashing with
// Spring's own org.springframework.stereotype.Service annotation.
@Document(collection = "services")
public class ClinicService {

    @Id
    private String id;

    // Indexed so admin/patient can search services by name efficiently
    @Indexed
    private String name;

    private String description;
    private int durationMinutes;

    // Soft-delete flag: inactive services stay in the DB (so past appointments
    // still resolve) but can no longer be booked or shown to patients.
    private boolean active;

    public ClinicService() {
    }

    public ClinicService(String name, String description, int durationMinutes, boolean active) {
        this.name = name;
        this.description = description;
        this.durationMinutes = durationMinutes;
        this.active = active;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
