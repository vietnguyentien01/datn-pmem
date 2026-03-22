package com.pmem.service;

import com.pmem.model.Employee;
import com.pmem.model.LeaveRequest;
import com.pmem.model.User;
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

    public List<LeaveRequest> getAllRequests(LeaveRequest.LeaveStatus status, String department, LocalDate startDate,
            LocalDate endDate) {
        return leaveRequestRepository.findWithFilters(status, department, startDate, endDate);
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

        if (request.getStatus() == LeaveRequest.LeaveStatus.APPROVED
                || request.getStatus() == LeaveRequest.LeaveStatus.REJECTED) {
            throw new RuntimeException("Yêu cầu này đã được xử lý xong!");
        }

        Employee approverEmployee = employeeRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin người duyệt"));

        User approverUser = approverEmployee.getUser();
        User requesterUser = request.getEmployee().getUser();

        // 1. Không tự duyệt đơn của mình
        if (request.getEmployee().getId().equals(managerId)) {
            throw new RuntimeException("Bạn không thể tự duyệt đơn nghỉ phép của chính mình!");
        }

        User.Role requesterRole = requesterUser.getRole();
        User.Role approverRole = approverUser.getRole();

        request.setApprovedBy(approverEmployee);
        request.setApprovedAt(LocalDateTime.now());

        if (!approved) {
            request.setStatus(LeaveRequest.LeaveStatus.REJECTED);
            request.setRejectReason(rejectReason);
            return leaveRequestRepository.save(request);
        }

        // Logic duyệt (Approval logic)
        // 2. Nếu người xin là Quản lý (MANAGER)
        if (requesterRole == User.Role.MANAGER) {
            if (approverRole != User.Role.MANAGER && approverRole != User.Role.ADMIN
                    && approverRole != User.Role.HR) {
                throw new RuntimeException("Đơn của Quản lý phải do Quản lý khác, HR hoặc Admin duyệt!");
            }
            request.setStatus(LeaveRequest.LeaveStatus.APPROVED);
        }
        // 3. Nếu người xin là Nhân sự (HR)
        else if (requesterRole == User.Role.HR) {
            if (approverRole != User.Role.ADMIN) {
                throw new RuntimeException("Đơn của Nhân sự phải do Admin duyệt!");
            }
            request.setStatus(LeaveRequest.LeaveStatus.APPROVED);
        }
        // 4. Nếu người xin là Nhân viên (EMPLOYEE) — chỉ cần 1 lần duyệt
        else {
            if (approverRole == User.Role.MANAGER || approverRole == User.Role.HR
                    || approverRole == User.Role.ADMIN) {
                request.setStatus(LeaveRequest.LeaveStatus.APPROVED);
            } else {
                throw new RuntimeException("Bạn không có quyền duyệt đơn này!");
            }
        }

        return leaveRequestRepository.save(request);
    }
}
