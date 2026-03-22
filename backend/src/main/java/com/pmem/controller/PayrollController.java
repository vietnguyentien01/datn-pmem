package com.pmem.controller;

import com.pmem.model.Payroll;
import com.pmem.service.PayrollService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/payroll")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;

    @GetMapping("/my/{employeeId}")
    public ResponseEntity<List<Payroll>> getMyPayrolls(@PathVariable Long employeeId) {
        return ResponseEntity.ok(payrollService.getMyPayrolls(employeeId));
    }

    @GetMapping("/my/{employeeId}/{year}/{month}")
    public ResponseEntity<Payroll> getMyPayrollByMonth(
            @PathVariable Long employeeId,
            @PathVariable Integer year,
            @PathVariable Integer month) {
        return ResponseEntity.ok(payrollService.getMyPayrollByMonth(employeeId, month, year));
    }

    @GetMapping("/all/{year}/{month}")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<List<Payroll>> getAllPayroll(
            @PathVariable Integer year,
            @PathVariable Integer month) {
        return ResponseEntity.ok(payrollService.getPayrollByMonthYear(month, year));
    }

    @PostMapping("/{employeeId}")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<Payroll> createOrUpdate(
            @PathVariable Long employeeId,
            @RequestBody Payroll payroll) {
        return ResponseEntity.ok(payrollService.createOrUpdatePayroll(employeeId, payroll));
    }
}
