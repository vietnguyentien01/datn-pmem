package com.pmem.controller;

import com.pmem.dto.SalaryChangeRequestDTO;
import com.pmem.service.SalaryChangeService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/salary-changes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class SalaryChangeController {

    private final SalaryChangeService salaryChangeService;

    @PostMapping("/request")
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<SalaryChangeRequestDTO> createRequest(@RequestBody SalaryChangePayload payload,
            Authentication authentication) {
        return ResponseEntity.ok(salaryChangeService.createRequest(payload.getEmployeeId(), payload.getNewSalary(),
                payload.getReason(), authentication.getName()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<List<SalaryChangeRequestDTO>> getAllRequests() {
        return ResponseEntity.ok(salaryChangeService.getAllRequests());
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SalaryChangeRequestDTO> approveRequest(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(salaryChangeService.approveRequest(id, authentication.getName()));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SalaryChangeRequestDTO> rejectRequest(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(salaryChangeService.rejectRequest(id, authentication.getName()));
    }

    @Data
    public static class SalaryChangePayload {
        private Long employeeId;
        private Double newSalary;
        private String reason;
    }
}
