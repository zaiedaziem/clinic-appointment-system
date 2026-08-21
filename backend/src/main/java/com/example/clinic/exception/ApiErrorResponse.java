package com.example.clinic.exception;

import com.example.clinic.dto.FieldErrorDetail;

import java.util.List;

public class ApiErrorResponse {

    private String message;
    private List<FieldErrorDetail> errors;

    public ApiErrorResponse(String message) {
        this.message = message;
        this.errors = List.of();
    }

    public ApiErrorResponse(String message, List<FieldErrorDetail> errors) {
        this.message = message;
        this.errors = errors;
    }

    public String getMessage() {
        return message;
    }

    public List<FieldErrorDetail> getErrors() {
        return errors;
    }
}
