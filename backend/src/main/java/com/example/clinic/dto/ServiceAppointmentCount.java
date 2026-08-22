package com.example.clinic.dto;

// Shape of one row from the "top services by appointment count" aggregation.
// Field names must match the aggregation pipeline's output field names
// exactly - Spring Data maps aggregation results onto this class by name.
public class ServiceAppointmentCount {

    private String serviceName;
    private long count;

    public ServiceAppointmentCount() {
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }
}
