package com.pmem.controller;

import com.pmem.model.LeaveRequest;
import com.pmem.service.LeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/leave")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;

    @GetMapping("/my/{employeeId}")
    public ResponseEntity<List<LeaveRequest>> getMyRequests(@PathVariable Long employeeId) {
        return ResponseEntity.ok(leaveService.getMyRequests(employeeId));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<LeaveRequest>> getPending() {
        return ResponseEntity.ok(leaveService.getAllPending());
    }

    @GetMapping("/all")
    public ResponseEntity<List<LeaveRequest>> getAll(
            @RequestParam(required = false) LeaveRequest.LeaveStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(leaveService.getAllRequests(status, startDate, endDate));
    }

    @PostMapping("/request/{employeeId}")
    public ResponseEntity<LeaveRequest> createRequest(
            @PathVariable Long employeeId,
            @RequestBody LeaveRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(leaveService.createRequest(employeeId, request));
    }

    @PutMapping("/approve/{requestId}")
    public ResponseEntity<LeaveRequest> approve(
            @PathVariable Long requestId,
            @RequestParam Long managerId,
            @RequestParam boolean approved,
            @RequestParam(required = false) String rejectReason) {
        return ResponseEntity.ok(leaveService.approve(requestId, managerId, approved, rejectReason));
    }
}
