package com.example.clinic.service;

import com.example.clinic.dto.DashboardResponse;
import com.example.clinic.dto.ServiceAppointmentCount;
import com.example.clinic.model.Appointment;
import com.example.clinic.model.AppointmentStatus;
import com.example.clinic.model.AppUser;
import com.example.clinic.model.ClinicService;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

// The MongoDB aggregation/reporting feature required by the brief (section
// 9.6), doubling as the data source for the admin dashboard.
@Service
public class ReportService {

    private final MongoTemplate mongoTemplate;
    private final com.example.clinic.repository.AppointmentRepository appointmentRepository;

    public ReportService(MongoTemplate mongoTemplate, com.example.clinic.repository.AppointmentRepository appointmentRepository) {
        this.mongoTemplate = mongoTemplate;
        this.appointmentRepository = appointmentRepository;
    }

    public DashboardResponse getDashboard() {
        long activeServices = mongoTemplate.count(Query.query(Criteria.where("active").is(true)), ClinicService.class);
        long inactiveServices = mongoTemplate.count(Query.query(Criteria.where("active").is(false)), ClinicService.class);

        long totalAppointments = appointmentRepository.count();
        long pending = countByStatus(AppointmentStatus.PENDING);
        long confirmed = countByStatus(AppointmentStatus.CONFIRMED);
        long cancelled = countByStatus(AppointmentStatus.CANCELLED);

        long totalPatients = mongoTemplate.count(Query.query(Criteria.where("role").is("PATIENT")), AppUser.class);

        // "Upcoming" = booked for the future and not cancelled - what an
        // admin actually cares about seeing on a dashboard at a glance.
        long upcoming = mongoTemplate.count(
                Query.query(Criteria.where("appointmentDateTime").gte(LocalDateTime.now())
                        .and("status").ne(AppointmentStatus.CANCELLED)),
                Appointment.class
        );

        return new DashboardResponse(
                activeServices, inactiveServices, totalAppointments,
                pending, confirmed, cancelled, totalPatients, upcoming, topServicesByAppointments()
        );
    }

    private long countByStatus(String status) {
        return mongoTemplate.count(Query.query(Criteria.where("status").is(status)), Appointment.class);
    }

    // The actual MongoDB aggregation pipeline: group all appointment documents
    // by serviceName, count how many fall into each group, sort descending,
    // and keep only the top 5 - "most popular services" from the brief's
    // example report list (section 9.6).
    private List<ServiceAppointmentCount> topServicesByAppointments() {
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.group("serviceName").count().as("count"),
                Aggregation.project("count").and("_id").as("serviceName"),
                Aggregation.sort(Sort.Direction.DESC, "count"),
                Aggregation.limit(5)
        );

        AggregationResults<ServiceAppointmentCount> results =
                mongoTemplate.aggregate(aggregation, "appointments", ServiceAppointmentCount.class);

        return results.getMappedResults();
    }
}
