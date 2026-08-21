package com.example.clinic.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

// Same as CreateServiceRequest but also allows toggling "active",
// since updating is the only way to reactivate a deactivated service.
public class UpdateServiceRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String description;

    @Min(value = 5, message = "Duration must be at least 5 minutes")
    private int durationMinutes;

    private boolean active;

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
