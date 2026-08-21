package com.example.clinic.repository;

import com.example.clinic.model.ClinicService;
import org.springframework.data.mongodb.repository.MongoRepository;

// Extending MongoRepository gives us findAll/findById/save/deleteById etc.
// for free - Spring Data generates the implementation at runtime.
public interface ClinicServiceRepository extends MongoRepository<ClinicService, String> {
}
