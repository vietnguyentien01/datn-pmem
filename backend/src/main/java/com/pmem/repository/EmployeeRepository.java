package com.pmem.repository;

import com.pmem.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
        Optional<Employee> findByUserId(Long userId);

        Optional<Employee> findByEmail(String email);

        List<Employee> findByDepartment(String department);

        List<Employee> findByStatus(Employee.EmployeeStatus status);

        long countByStatus(Employee.EmployeeStatus status);

        boolean existsByEmail(String email);

        boolean existsByEmployeeCode(String employeeCode);

        @Query("SELECT e FROM Employee e WHERE " +
                        "(:keyword IS NULL OR LOWER(e.fullName) LIKE LOWER(CAST(:keyword AS string)) OR " +
                        "LOWER(e.employeeCode) LIKE LOWER(CAST(:keyword AS string)) OR " +
                        "LOWER(e.email) LIKE LOWER(CAST(:keyword AS string))) AND " +
                        "(:status IS NULL OR e.status = :status) AND " +
                        "(:department IS NULL OR e.department = :department)")
        List<Employee> findEmployeesByKeyword(@Param("keyword") String keyword,
                        @Param("status") Employee.EmployeeStatus status,
                        @Param("department") String department);

        @Query("SELECT DISTINCT e.department FROM Employee e WHERE e.department IS NOT NULL ORDER BY e.department")
        List<String> findDistinctDepartments();

        @Query("SELECT MAX(e.employeeCode) FROM Employee e")
        String findMaxEmployeeCode();
}
