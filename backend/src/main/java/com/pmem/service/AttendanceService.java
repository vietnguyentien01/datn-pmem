package com.pmem.service;

import com.pmem.model.Attendance;
import com.pmem.model.Employee;
import com.pmem.repository.AttendanceRepository;
import com.pmem.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    public List<Attendance> getMyAttendance(Long employeeId) {
        return attendanceRepository.findByEmployeeIdOrderByDateDesc(employeeId);
    }

    public List<Attendance> getMyAttendanceByRange(Long employeeId, LocalDate start, LocalDate end) {
        return attendanceRepository.findByEmployeeIdAndDateBetweenOrderByDateDesc(employeeId, start, end);
    }

    public List<Attendance> getAllTodayAttendance() {
        return attendanceRepository.findByDate(LocalDate.now());
    }

    public List<Attendance> getAllAttendance(Long employeeId, LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.findAllWithFilters(employeeId, startDate, endDate);
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

        LocalTime now = LocalTime.now();
        Attendance.AttendanceStatus status = now.isAfter(LocalTime.of(8, 30))
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

        attendance.setCheckOut(LocalTime.now());
        return attendanceRepository.save(attendance);
    }

    public Optional<Attendance> getTodayAttendance(Long employeeId) {
        return attendanceRepository.findByEmployeeIdAndDate(employeeId, LocalDate.now());
    }
}
