package com.example.clinic.model;

// Plain string constants instead of a Java enum - keeps MongoDB documents
// storing simple readable strings and avoids enum-mapping configuration.
public final class AppointmentStatus {

    public static final String PENDING = "PENDING";
    public static final String CONFIRMED = "CONFIRMED";
    public static final String CANCELLED = "CANCELLED";

    private AppointmentStatus() {
    }
}
