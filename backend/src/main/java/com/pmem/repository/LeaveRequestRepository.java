package com.pmem.repository;

import com.pmem.model.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
        List<LeaveRequest> findByEmployeeIdOrderByCreatedAtDesc(Long employeeId);

        List<LeaveRequest> findByStatusOrderByCreatedAtDesc(LeaveRequest.LeaveStatus status);

        List<LeaveRequest> findAllByOrderByCreatedAtDesc();

        long countByStatus(LeaveRequest.LeaveStatus status);

        @Query("SELECT COUNT(DISTINCT l.employee.id) FROM LeaveRequest l WHERE l.status = 'APPROVED' AND l.startDate <= :today AND l.endDate >= :today")
        long countOnLeaveToday(@Param("today") LocalDate today);

        @Query("SELECT l FROM LeaveRequest l WHERE " +
                        "(:status IS NULL OR l.status = :status) AND " +
                        "(:department IS NULL OR l.employee.department = :department) AND " +
                        "(cast(:startDate as date) IS NULL OR l.startDate >= :startDate) AND " +
                        "(cast(:endDate as date) IS NULL OR l.endDate <= :endDate) " +
                        "ORDER BY l.createdAt DESC")
        List<LeaveRequest> findWithFilters(
                        @Param("status") LeaveRequest.LeaveStatus status,
                        @Param("department") String department,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);
}
