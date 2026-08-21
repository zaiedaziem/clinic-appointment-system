package com.example.clinic.dto;

// What gets sent back to the client - controls exactly what's exposed,
// separate from the internal ClinicService entity/collection shape.
public class ServiceResponse {

    private String id;
    private String name;
    private String description;
    private int durationMinutes;
    private boolean active;

    public ServiceResponse(String id, String name, String description, int durationMinutes, boolean active) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.durationMinutes = durationMinutes;
        this.active = active;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public boolean isActive() {
        return active;
    }
}
