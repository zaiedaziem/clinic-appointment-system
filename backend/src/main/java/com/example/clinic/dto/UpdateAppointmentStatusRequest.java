package com.example.clinic.dto;

import jakarta.validation.constraints.NotBlank;

// Admin-only: used to confirm or cancel a patient's appointment.
public class UpdateAppointmentStatusRequest {

    @NotBlank(message = "Status is required")
    private String status;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
