package com.example.clinic.config;

import com.example.clinic.model.ClinicService;
import com.example.clinic.repository.ClinicServiceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.util.List;

// Seeds sample clinic services on startup so you don't have to create them
// one-by-one through the admin UI or .http requests every time the database
// is reset. Only runs if the collection is empty - safe to restart repeatedly.
// Runs after UserDataSeeder (@Order(1)) and before AppointmentDataSeeder (@Order(3)),
// since appointments need these services to already exist.
@Configuration
public class ServiceDataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(ServiceDataSeeder.class);

    @Bean
    @Order(2)
    CommandLineRunner seedServices(ClinicServiceRepository clinicServiceRepository) {
        return args -> {
            if (clinicServiceRepository.count() > 0) {
                logger.info("Services already seeded, skipping");
                return;
            }

            List<ClinicService> services = List.of(
                    new ClinicService("General Consultation", "Standard GP consultation for common illnesses", 30, true),
                    new ClinicService("Dental Checkup", "Routine dental examination and cleaning", 45, true),
                    new ClinicService("Physiotherapy Session", "One-on-one physiotherapy treatment", 60, true),
                    new ClinicService("Vaccination", "Routine or travel vaccination administration", 15, true),
                    new ClinicService("Eye Examination", "Comprehensive vision and eye health check", 30, true),
                    new ClinicService("Blood Test", "Routine blood sample collection and screening", 15, true),
                    new ClinicService("Skin Consultation", "Dermatology consultation for skin conditions", 30, true),
                    new ClinicService("Nutrition Counselling", "Dietary assessment and meal planning session", 45, true),
                    new ClinicService("Mental Health Consultation", "Confidential consultation with a counsellor", 60, true),
                    new ClinicService("X-Ray Imaging", "Diagnostic X-ray imaging session", 20, false)
            );

            clinicServiceRepository.saveAll(services);
            logger.info("Seeded {} clinic services", services.size());
        };
    }
}
