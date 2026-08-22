package com.example.clinic.config;

import com.example.clinic.model.Appointment;
import com.example.clinic.model.AppointmentStatus;
import com.example.clinic.model.AppUser;
import com.example.clinic.model.ClinicService;
import com.example.clinic.repository.AppointmentRepository;
import com.example.clinic.repository.AppUserRepository;
import com.example.clinic.repository.ClinicServiceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

// Runs last (@Order(3)) - depends on the patient users (Alex, registered
// manually; Ahmad Faiz, from UserDataSeeder) and services already existing.
@Configuration
public class AppointmentDataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(AppointmentDataSeeder.class);

    @Bean
    @Order(3)
    CommandLineRunner seedAppointments(
            AppointmentRepository appointmentRepository,
            ClinicServiceRepository clinicServiceRepository,
            AppUserRepository appUserRepository) {

        return args -> {
            if (appointmentRepository.count() > 0) {
                logger.info("Appointments already seeded, skipping");
                return;
            }

            AppUser patientOne = appUserRepository.findByEmailIgnoreCase("alex.patient@example.com").orElse(null);
            AppUser patientTwo = appUserRepository.findByEmailIgnoreCase("ahmadfaiz@example.com").orElse(null);
            List<ClinicService> services = clinicServiceRepository.findAll();

            if (patientOne == null || patientTwo == null || services.size() < 4) {
                logger.warn("Skipping appointment seeding - patients or services not ready yet");
                return;
            }

            LocalDateTime today = LocalDateTime.of(LocalDateTime.now().toLocalDate(), LocalTime.of(9, 0));

            List<Appointment> appointments = List.of(
                    // Patient 1 (Alex): an upcoming pending booking and a completed past visit
                    bookedAppointment(patientOne, services.get(0), today.plusDays(3), AppointmentStatus.PENDING, "First visit"),
                    bookedAppointment(patientOne, services.get(2), today.minusDays(10), AppointmentStatus.CONFIRMED, "Follow-up needed"),

                    // Patient 2 (Ahmad Faiz): a confirmed upcoming booking and a cancelled one
                    bookedAppointment(patientTwo, services.get(1), today.plusDays(5), AppointmentStatus.CONFIRMED, null),
                    bookedAppointment(patientTwo, services.get(3), today.minusDays(2), AppointmentStatus.CANCELLED, "Rescheduled by patient")
            );

            appointmentRepository.saveAll(appointments);
            logger.info("Seeded {} appointments across 2 patients", appointments.size());
        };
    }

    private Appointment bookedAppointment(
            AppUser patient, ClinicService service, LocalDateTime dateTime, String status, String notes) {

        return new Appointment(
                patient.getId(),
                patient.getName(),
                service.getId(),
                service.getName(),
                dateTime,
                status,
                notes
        );
    }
}
