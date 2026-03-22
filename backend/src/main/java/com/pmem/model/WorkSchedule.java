package com.pmem.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;

@Entity
@Table(name = "work_schedule")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "standard_check_in", nullable = false)
    private LocalTime standardCheckIn;

    @Column(name = "standard_check_out", nullable = false)
    private LocalTime standardCheckOut;

    @Column(name = "late_threshold_minutes", nullable = false)
    private Integer lateThresholdMinutes;

    @Column(name = "early_leave_threshold_minutes", nullable = false)
    private Integer earlyLeaveThresholdMinutes;
}
