package com.example.clinic.controller;

import com.example.clinic.dto.AppointmentResponse;
import com.example.clinic.dto.CreateAppointmentRequest;
import com.example.clinic.dto.PagedResponse;
import com.example.clinic.dto.UpdateAppointmentStatusRequest;
import com.example.clinic.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

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

    // "My Records" page - paginated
    @GetMapping("/me")
    public PagedResponse<AppointmentResponse> listOwn(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return appointmentService.listOwn(jwt.getClaimAsString("userId"), page, size);
    }

    // Admin: view all appointment records, optionally filtered by status - paginated
    @GetMapping
    public PagedResponse<AppointmentResponse> listAll(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        requireAdmin(jwt);
        return appointmentService.listAll(status, page, size);
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
