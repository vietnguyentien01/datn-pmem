package com.pmem.controller;

import com.pmem.model.WorkSchedule;
import com.pmem.service.WorkScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/work-schedule")
@RequiredArgsConstructor
public class WorkScheduleController {

    private final WorkScheduleService workScheduleService;

    @GetMapping
    public ResponseEntity<WorkSchedule> getSchedule() {
        return ResponseEntity.ok(workScheduleService.getSchedule());
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<WorkSchedule> updateSchedule(@RequestBody WorkSchedule schedule) {
        return ResponseEntity.ok(workScheduleService.updateSchedule(schedule));
    }
}
