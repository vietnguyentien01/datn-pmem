package com.pmem.repository;

import com.pmem.model.SalaryChangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalaryChangeRequestRepository extends JpaRepository<SalaryChangeRequest, Long> {
    List<SalaryChangeRequest> findByEmployeeIdOrderByCreatedAtDesc(Long employeeId);

    List<SalaryChangeRequest> findAllByOrderByCreatedAtDesc();
}
