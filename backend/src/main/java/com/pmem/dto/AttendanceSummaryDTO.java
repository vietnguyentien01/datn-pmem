package com.pmem.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AttendanceSummaryDTO {
    private Long employeeId;
    private String employeeCode;
    private String fullName;
    private String department;
    private int totalDays;
    private int presentDays;
    private int lateDays;
    private int absentDays;
    private int leaveDays;
    private double totalWorkHours;
}
