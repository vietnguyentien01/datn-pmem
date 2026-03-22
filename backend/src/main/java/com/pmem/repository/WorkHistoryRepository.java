package com.pmem.repository;

import com.pmem.model.WorkHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WorkHistoryRepository extends JpaRepository<WorkHistory, Long> {
    List<WorkHistory> findByEmployeeIdOrderByStartDateDesc(Long employeeId);
}
