package com.example.clinic.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

// What an admin is allowed to send when creating a service.
// Deliberately has no "id" or "active" field - those are server-controlled.
public class CreateServiceRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String description;

    @Min(value = 5, message = "Duration must be at least 5 minutes")
    private int durationMinutes;

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
}
