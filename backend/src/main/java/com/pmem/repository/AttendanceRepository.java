package com.pmem.repository;

import com.pmem.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
        List<Attendance> findByEmployeeIdOrderByDateDesc(Long employeeId);

        Optional<Attendance> findByEmployeeIdAndDate(Long employeeId, LocalDate date);

        List<Attendance> findByDate(LocalDate date);

        List<Attendance> findByEmployeeIdAndDateBetweenOrderByDateDesc(Long employeeId, LocalDate start, LocalDate end);

        @Query("SELECT COUNT(DISTINCT a.employee.id) FROM Attendance a WHERE a.date = :date AND a.status IN ('PRESENT', 'LATE_EARLY')")
        long countPresentToday(@Param("date") LocalDate date);

        @Query("SELECT COUNT(DISTINCT a.employee.id) FROM Attendance a WHERE a.date = :date AND a.status = 'LATE'")
        long countLateToday(@Param("date") LocalDate date);

        @Query("SELECT a FROM Attendance a WHERE " +
                        "(:employeeId IS NULL OR a.employee.id = :employeeId) AND " +
                        "(:department IS NULL OR a.employee.department = :department) AND " +
                        "(:employeeCode IS NULL OR a.employee.employeeCode = :employeeCode) AND " +
                        "(cast(:startDate as date) IS NULL OR a.date >= :startDate) AND " +
                        "(cast(:endDate as date) IS NULL OR a.date <= :endDate) " +
                        "ORDER BY a.date DESC")
        List<Attendance> findAllWithFilters(
                        @Param("employeeId") Long employeeId,
                        @Param("department") String department,
                        @Param("employeeCode") String employeeCode,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);
}
