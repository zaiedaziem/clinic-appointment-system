package com.example.clinic.exception;

// Thrown when a request is well-formed but breaks a domain rule
// (e.g. booking a past slot, double-booking, booking an inactive service).
public class BusinessRuleViolationException extends RuntimeException {

    public BusinessRuleViolationException(String message) {
        super(message);
    }
}
