package com.example.clinic.dto;

import java.util.List;

// Everything the admin dashboard page needs, in a single response so the
// frontend only makes one request on page load.
public class DashboardResponse {

    private long activeServices;
    private long inactiveServices;
    private long totalAppointments;
    private long pendingAppointments;
    private long confirmedAppointments;
    private long cancelledAppointments;
    private long totalPatients;
    private long upcomingAppointments;
    private List<ServiceAppointmentCount> topServices;

    public DashboardResponse(
            long activeServices, long inactiveServices, long totalAppointments,
            long pendingAppointments, long confirmedAppointments, long cancelledAppointments,
            long totalPatients, long upcomingAppointments, List<ServiceAppointmentCount> topServices) {
        this.activeServices = activeServices;
        this.inactiveServices = inactiveServices;
        this.totalAppointments = totalAppointments;
        this.pendingAppointments = pendingAppointments;
        this.confirmedAppointments = confirmedAppointments;
        this.cancelledAppointments = cancelledAppointments;
        this.totalPatients = totalPatients;
        this.upcomingAppointments = upcomingAppointments;
        this.topServices = topServices;
    }

    public long getActiveServices() {
        return activeServices;
    }

    public long getInactiveServices() {
        return inactiveServices;
    }

    public long getTotalAppointments() {
        return totalAppointments;
    }

    public long getPendingAppointments() {
        return pendingAppointments;
    }

    public long getConfirmedAppointments() {
        return confirmedAppointments;
    }

    public long getCancelledAppointments() {
        return cancelledAppointments;
    }

    public long getTotalPatients() {
        return totalPatients;
    }

    public long getUpcomingAppointments() {
        return upcomingAppointments;
    }

    public List<ServiceAppointmentCount> getTopServices() {
        return topServices;
    }
}
