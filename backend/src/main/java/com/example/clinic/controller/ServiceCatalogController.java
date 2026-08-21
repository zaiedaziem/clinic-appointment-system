package com.example.clinic.controller;

import com.example.clinic.dto.CreateServiceRequest;
import com.example.clinic.dto.ServiceResponse;
import com.example.clinic.dto.UpdateServiceRequest;
import com.example.clinic.service.ServiceCatalogService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// GET endpoints: any authenticated user (PATIENT or ADMIN) - see SecurityConfig.
// POST/PUT/DELETE endpoints: ADMIN only - also enforced in SecurityConfig,
// not just left to the frontend to hide the buttons.
@RestController
@RequestMapping("/api/services")
public class ServiceCatalogController {

    private final ServiceCatalogService serviceCatalogService;

    public ServiceCatalogController(ServiceCatalogService serviceCatalogService) {
        this.serviceCatalogService = serviceCatalogService;
    }

    @GetMapping
    public List<ServiceResponse> listAll() {
        return serviceCatalogService.listAll();
    }

    @GetMapping("/{id}")
    public ServiceResponse getById(@PathVariable String id) {
        return serviceCatalogService.getById(id);
    }

    @PostMapping
    public ResponseEntity<ServiceResponse> create(@Valid @RequestBody CreateServiceRequest request) {
        ServiceResponse response = serviceCatalogService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ServiceResponse update(@PathVariable String id, @Valid @RequestBody UpdateServiceRequest request) {
        return serviceCatalogService.update(id, request);
    }

    // DELETE is still the correct REST verb here even though it only
    // deactivates internally - the client-facing contract is "remove this".
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(@PathVariable String id) {
        serviceCatalogService.deactivate(id);
        return ResponseEntity.noContent().build();
    }
}
