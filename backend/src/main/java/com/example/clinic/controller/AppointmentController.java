package com.example.clinic.controller;

import com.example.clinic.dto.AppointmentResponse;
import com.example.clinic.dto.CreateAppointmentRequest;
import com.example.clinic.dto.UpdateAppointmentStatusRequest;
import com.example.clinic.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// All endpoints here require PATIENT or ADMIN (see SecurityConfig for the base path rule).
// Fine-grained checks (own record vs admin, admin-only actions) happen here and in
// AppointmentService, because "is this MY record" can't be expressed as a static URL rule.
@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<AppointmentResponse> create(
            @Valid @RequestBody CreateAppointmentRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        AppointmentResponse response = appointmentService.create(
                request,
                jwt.getClaimAsString("userId"),
                jwt.getClaimAsString("name")
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // "My Records" page
    @GetMapping("/me")
    public List<AppointmentResponse> listOwn(@AuthenticationPrincipal Jwt jwt) {
        return appointmentService.listOwn(jwt.getClaimAsString("userId"));
    }

    // Admin: view all appointment records
    @GetMapping
    public List<AppointmentResponse> listAll(@AuthenticationPrincipal Jwt jwt) {
        requireAdmin(jwt);
        return appointmentService.listAll();
    }

    @GetMapping("/{id}")
    public AppointmentResponse getById(@PathVariable String id, @AuthenticationPrincipal Jwt jwt) {
        return appointmentService.getById(id, jwt.getClaimAsString("userId"), isAdmin(jwt));
    }

    // Patient cancels their own appointment, or admin cancels any
    @PutMapping("/{id}/cancel")
    public AppointmentResponse cancel(@PathVariable String id, @AuthenticationPrincipal Jwt jwt) {
        return appointmentService.cancel(id, jwt.getClaimAsString("userId"), isAdmin(jwt));
    }

    // Admin only: confirm or otherwise change an appointment's status
    @PutMapping("/{id}/status")
    public AppointmentResponse updateStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateAppointmentStatusRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        requireAdmin(jwt);
        return appointmentService.updateStatus(id, request);
    }

    private boolean isAdmin(Jwt jwt) {
        return "ADMIN".equals(jwt.getClaimAsString("role"));
    }

    private void requireAdmin(Jwt jwt) {
        if (!isAdmin(jwt)) {
            throw new AccessDeniedException("Admin access required");
        }
    }
}
