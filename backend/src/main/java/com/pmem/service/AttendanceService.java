package com.pmem.service;

import com.pmem.dto.AttendanceSummaryDTO;
import com.pmem.dto.AttendanceUpdateDTO;
import com.pmem.model.Attendance;
import com.pmem.model.Employee;
import com.pmem.model.WorkSchedule;
import com.pmem.repository.AttendanceRepository;
import com.pmem.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;
    private final WorkScheduleService workScheduleService;

    public List<Attendance> getMyAttendance(Long employeeId) {
        return attendanceRepository.findByEmployeeIdOrderByDateDesc(employeeId);
    }

    public List<Attendance> getMyAttendanceByRange(Long employeeId, LocalDate start, LocalDate end) {
        return attendanceRepository.findByEmployeeIdAndDateBetweenOrderByDateDesc(employeeId, start, end);
    }

    public List<Attendance> getAllTodayAttendance() {
        return attendanceRepository.findByDate(LocalDate.now());
    }

    public List<Attendance> getAllAttendance(Long employeeId, String department, String employeeCode,
            LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.findAllWithFilters(employeeId, department, employeeCode, startDate, endDate);
    }

    @Transactional
    public Attendance checkIn(Long employeeId) {
        LocalDate today = LocalDate.now();
        Optional<Attendance> existing = attendanceRepository.findByEmployeeIdAndDate(employeeId, today);
        if (existing.isPresent()) {
            throw new RuntimeException("Bạn đã check-in hôm nay rồi!");
        }
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));

        LocalTime now = LocalTime.now().truncatedTo(java.time.temporal.ChronoUnit.SECONDS);
        WorkSchedule schedule = workScheduleService.getSchedule();
        LocalTime lateThreshold = schedule.getStandardCheckIn().plusMinutes(schedule.getLateThresholdMinutes());

        Attendance.AttendanceStatus status = now.isAfter(lateThreshold)
                ? Attendance.AttendanceStatus.LATE
                : Attendance.AttendanceStatus.PRESENT;

        Attendance attendance = Attendance.builder()
                .employee(employee)
                .date(today)
                .checkIn(now)
                .status(status)
                .build();

        return attendanceRepository.save(attendance);
    }

    @Transactional
    public Attendance checkOut(Long employeeId) {
        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(employeeId, today)
                .orElseThrow(() -> new RuntimeException("Bạn chưa check-in hôm nay!"));

        if (attendance.getCheckOut() != null) {
            throw new RuntimeException("Bạn đã check-out hôm nay rồi!");
        }

        attendance.setCheckOut(LocalTime.now().truncatedTo(java.time.temporal.ChronoUnit.SECONDS));

        // Evaluate working hours for LATE_EARLY status
        long minutesWorked = java.time.Duration.between(attendance.getCheckIn(), attendance.getCheckOut()).toMinutes();
        if (minutesWorked < 8 * 60) {
            attendance.setStatus(Attendance.AttendanceStatus.LATE_EARLY);
        }

        return attendanceRepository.save(attendance);
    }

    public Optional<Attendance> getTodayAttendance(Long employeeId) {
        return attendanceRepository.findByEmployeeIdAndDate(employeeId, LocalDate.now());
    }

    @Transactional
    public Attendance updateAttendance(Long id, AttendanceUpdateDTO dto) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bản ghi chấm công"));

        if (dto.getCheckIn() != null) {
            attendance.setCheckIn(dto.getCheckIn());
        }
        if (dto.getCheckOut() != null) {
            attendance.setCheckOut(dto.getCheckOut());
        }
        if (dto.getStatus() != null) {
            attendance.setStatus(Attendance.AttendanceStatus.valueOf(dto.getStatus()));
        }

        // Auto-recalculate status if both times are present, unless manually overridden
        // to leave/absent
        if (attendance.getCheckIn() != null && attendance.getCheckOut() != null) {
            if (attendance.getStatus() != Attendance.AttendanceStatus.ON_LEAVE
                    && attendance.getStatus() != Attendance.AttendanceStatus.ABSENT) {
                WorkSchedule schedule = workScheduleService.getSchedule();
                LocalTime lateThreshold = schedule.getStandardCheckIn().plusMinutes(schedule.getLateThresholdMinutes());

                Attendance.AttendanceStatus computedStatus = attendance.getCheckIn().isAfter(lateThreshold)
                        ? Attendance.AttendanceStatus.LATE
                        : Attendance.AttendanceStatus.PRESENT;

                long minutesWorked = java.time.Duration.between(attendance.getCheckIn(), attendance.getCheckOut())
                        .toMinutes();
                if (minutesWorked < 8 * 60) {
                    computedStatus = Attendance.AttendanceStatus.LATE_EARLY;
                }

                attendance.setStatus(computedStatus);
            }
        }

        if (dto.getNote() != null) {
            attendance.setNote(dto.getNote());
        }
        return attendanceRepository.save(attendance);
    }

    public List<AttendanceSummaryDTO> getAttendanceSummary(String department, LocalDate startDate, LocalDate endDate) {
        List<Attendance> records = attendanceRepository.findAllWithFilters(null, department, null, startDate, endDate);

        Map<Long, List<Attendance>> grouped = records.stream()
                .collect(Collectors.groupingBy(a -> a.getEmployee().getId()));

        List<AttendanceSummaryDTO> summaries = new ArrayList<>();
        for (Map.Entry<Long, List<Attendance>> entry : grouped.entrySet()) {
            List<Attendance> empRecords = entry.getValue();
            Employee emp = empRecords.get(0).getEmployee();

            int presentDays = 0, lateDays = 0, absentDays = 0, leaveDays = 0;
            double totalHours = 0;

            for (Attendance a : empRecords) {
                switch (a.getStatus()) {
                    case PRESENT:
                        presentDays++;
                        break;
                    case LATE:
                        lateDays++;
                        break;
                    case ABSENT:
                        absentDays++;
                        break;
                    case ON_LEAVE:
                        leaveDays++;
                        break;
                    case HALF_DAY:
                        presentDays++;
                        break;
                    case LATE_EARLY:
                        lateDays++;
                        break;
                }
                if (a.getCheckIn() != null && a.getCheckOut() != null) {
                    totalHours += Duration.between(a.getCheckIn(), a.getCheckOut()).toMinutes() / 60.0;
                }
            }

            summaries.add(AttendanceSummaryDTO.builder()
                    .employeeId(emp.getId())
                    .employeeCode(emp.getEmployeeCode())
                    .fullName(emp.getFullName())
                    .department(emp.getDepartment())
                    .totalDays(empRecords.size())
                    .presentDays(presentDays)
                    .lateDays(lateDays)
                    .absentDays(absentDays)
                    .leaveDays(leaveDays)
                    .totalWorkHours(Math.round(totalHours * 100.0) / 100.0)
                    .build());
        }
        return summaries;
    }
}
