package com.pmem.controller;

import com.pmem.dto.AttendanceSummaryDTO;
import com.pmem.dto.AttendanceUpdateDTO;
import com.pmem.model.Attendance;
import com.pmem.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping("/my/{employeeId}")
    public ResponseEntity<List<Attendance>> getMyAttendance(@PathVariable Long employeeId) {
        return ResponseEntity.ok(attendanceService.getMyAttendance(employeeId));
    }

    @GetMapping("/my/{employeeId}/range")
    public ResponseEntity<List<Attendance>> getMyAttendanceRange(
            @PathVariable Long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return ResponseEntity.ok(attendanceService.getMyAttendanceByRange(employeeId, start, end));
    }

    @GetMapping("/today")
    public ResponseEntity<List<Attendance>> getTodayAll() {
        return ResponseEntity.ok(attendanceService.getAllTodayAttendance());
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<List<Attendance>> getAll(
            @RequestParam(required = false) Long employeeId,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String employeeCode,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity
                .ok(attendanceService.getAllAttendance(employeeId, department, employeeCode, startDate, endDate));
    }

    @GetMapping("/summary")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<List<AttendanceSummaryDTO>> getSummary(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(attendanceService.getAttendanceSummary(department, startDate, endDate));
    }

    @GetMapping("/today/{employeeId}")
    public ResponseEntity<Map<String, Object>> getTodayStatus(@PathVariable Long employeeId) {
        return attendanceService.getTodayAttendance(employeeId)
                .map(a -> {
                    Map<String, Object> res = new java.util.HashMap<>();
                    res.put("hasCheckedIn", true);
                    res.put("hasCheckedOut", a.getCheckOut() != null);
                    res.put("checkIn", a.getCheckIn().toString());
                    res.put("checkOut", a.getCheckOut() != null ? a.getCheckOut().toString() : "");
                    res.put("status", a.getStatus().name());
                    return ResponseEntity.ok(res);
                })
                .orElseGet(() -> {
                    Map<String, Object> res = new java.util.HashMap<>();
                    res.put("hasCheckedIn", false);
                    res.put("hasCheckedOut", false);
                    return ResponseEntity.ok(res);
                });
    }

    @PostMapping("/checkin/{employeeId}")
    public ResponseEntity<Attendance> checkIn(@PathVariable Long employeeId) {
        return ResponseEntity.ok(attendanceService.checkIn(employeeId));
    }

    @PostMapping("/checkout/{employeeId}")
    public ResponseEntity<Attendance> checkOut(@PathVariable Long employeeId) {
        return ResponseEntity.ok(attendanceService.checkOut(employeeId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<Attendance> updateAttendance(
            @PathVariable Long id,
            @RequestBody AttendanceUpdateDTO dto) {
        return ResponseEntity.ok(attendanceService.updateAttendance(id, dto));
    }
}
