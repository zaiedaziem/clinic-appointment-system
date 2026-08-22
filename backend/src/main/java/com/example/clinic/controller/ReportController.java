package com.example.clinic.controller;

import com.example.clinic.dto.DashboardResponse;
import com.example.clinic.service.ReportService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Admin-only (enforced by SecurityConfig: /api/reports/** requires ROLE_ADMIN)
@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/dashboard")
    public DashboardResponse dashboard() {
        return reportService.getDashboard();
    }
}
