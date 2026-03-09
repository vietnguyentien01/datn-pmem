package com.pmem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStats {
    private long totalEmployees;
    private long presentToday;
    private long absentToday;
    private long lateToday;
    private long onLeaveToday;
    private long pendingLeaveRequests;
    private double attendanceRate;
}
