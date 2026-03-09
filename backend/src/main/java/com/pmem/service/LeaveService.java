package com.pmem.service;

import com.pmem.model.Employee;
import com.pmem.model.LeaveRequest;
import com.pmem.repository.EmployeeRepository;
import com.pmem.repository.LeaveRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;

    public List<LeaveRequest> getMyRequests(Long employeeId) {
        return leaveRequestRepository.findByEmployeeIdOrderByCreatedAtDesc(employeeId);
    }

    public List<LeaveRequest> getAllPending() {
        return leaveRequestRepository.findByStatusOrderByCreatedAtDesc(LeaveRequest.LeaveStatus.PENDING);
    }

    public List<LeaveRequest> getAllRequests(LeaveRequest.LeaveStatus status, LocalDate startDate, LocalDate endDate) {
        return leaveRequestRepository.findWithFilters(status, startDate, endDate);
    }

    @Transactional
    public LeaveRequest createRequest(Long employeeId, LeaveRequest request) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));
        request.setEmployee(employee);
        request.setStatus(LeaveRequest.LeaveStatus.PENDING);
        return leaveRequestRepository.save(request);
    }

    @Transactional
    public LeaveRequest approve(Long requestId, Long managerId, boolean approved, String rejectReason) {
        LeaveRequest request = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu nghỉ phép"));

        if (request.getStatus() != LeaveRequest.LeaveStatus.PENDING) {
            throw new RuntimeException("Yêu cầu này đã được xử lý rồi!");
        }

        Employee manager = employeeRepository.findById(managerId).orElse(null);
        request.setApprovedBy(manager);
        request.setApprovedAt(LocalDateTime.now());

        if (approved) {
            request.setStatus(LeaveRequest.LeaveStatus.APPROVED);
        } else {
            request.setStatus(LeaveRequest.LeaveStatus.REJECTED);
            request.setRejectReason(rejectReason);
        }

        return leaveRequestRepository.save(request);
    }
}
