package com.pmem.service;

import com.pmem.dto.DashboardStats;
import com.pmem.repository.AttendanceRepository;
import com.pmem.repository.EmployeeRepository;
import com.pmem.repository.LeaveRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;

    public DashboardStats getStats() {
        LocalDate today = LocalDate.now();
        long totalEmployees = employeeRepository.countByStatus(com.pmem.model.Employee.EmployeeStatus.ACTIVE) > 0
                ? employeeRepository.findByStatus(com.pmem.model.Employee.EmployeeStatus.ACTIVE).size()
                : employeeRepository.count();

        long presentToday = attendanceRepository.countPresentToday(today);
        long lateToday = attendanceRepository.countLateToday(today);
        long pendingLeave = leaveRequestRepository.countByStatus(com.pmem.model.LeaveRequest.LeaveStatus.PENDING);

        long absentToday = totalEmployees - presentToday - lateToday;
        if (absentToday < 0)
            absentToday = 0;

        double attendanceRate = totalEmployees > 0
                ? ((double) (presentToday + lateToday) / totalEmployees) * 100
                : 0;

        return DashboardStats.builder()
                .totalEmployees(totalEmployees)
                .presentToday(presentToday)
                .lateToday(lateToday)
                .absentToday(absentToday)
                .onLeaveToday(0)
                .pendingLeaveRequests(pendingLeave)
                .attendanceRate(Math.round(attendanceRate * 10.0) / 10.0)
                .build();
    }
}
