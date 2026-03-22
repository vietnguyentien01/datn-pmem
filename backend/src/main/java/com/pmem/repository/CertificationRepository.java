package com.pmem.repository;

import com.pmem.model.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CertificationRepository extends JpaRepository<Certification, Long> {
    List<Certification> findByEmployeeIdOrderByIssueDateDesc(Long employeeId);
}
