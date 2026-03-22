package com.pmem.service;

import com.pmem.dto.SalaryChangeRequestDTO;
import com.pmem.model.Employee;
import com.pmem.model.SalaryChangeRequest;
import com.pmem.model.User;
import com.pmem.repository.EmployeeRepository;
import com.pmem.repository.SalaryChangeRequestRepository;
import com.pmem.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalaryChangeService {

    private final SalaryChangeRequestRepository requestRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public SalaryChangeRequestDTO createRequest(Long employeeId, Double newSalary, String reason,
            String requestedByEmail) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        User requestedBy = userRepository.findByUsername(requestedByEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        SalaryChangeRequest request = SalaryChangeRequest.builder()
                .employee(employee)
                .oldSalary(employee.getBaseSalary())
                .newSalary(newSalary)
                .reason(reason)
                .status(SalaryChangeRequest.RequestStatus.PENDING)
                .requestedBy(requestedBy)
                .build();

        return mapToDTO(requestRepository.save(request));
    }

    public List<SalaryChangeRequestDTO> getAllRequests() {
        return requestRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public SalaryChangeRequestDTO approveRequest(Long requestId, String approvedByEmail) {
        SalaryChangeRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() != SalaryChangeRequest.RequestStatus.PENDING) {
            throw new RuntimeException("Request is not pending validation");
        }

        User approvedBy = userRepository.findByUsername(approvedByEmail)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        request.setStatus(SalaryChangeRequest.RequestStatus.APPROVED);
        request.setApprovedBy(approvedBy);
        request.setApprovedAt(LocalDateTime.now());

        // Cập nhật lương nhân viên
        Employee employee = request.getEmployee();
        employee.setBaseSalary(request.getNewSalary());
        employeeRepository.save(employee);

        // Gửi Notification
        if (employee.getUser() != null) {
            String title = "Cập nhật lương cố định";
            String message = String.format(
                    "Mức lương cố định của bạn đã được cập nhật từ %,.0f đ thành %,.0f đ. Có hiệu lực ngay lập tức.",
                    request.getOldSalary(), request.getNewSalary());
            notificationService.createNotification(employee.getUser().getId(), title, message);
        }

        return mapToDTO(requestRepository.save(request));
    }

    @Transactional
    public SalaryChangeRequestDTO rejectRequest(Long requestId, String rejectedByEmail) {
        SalaryChangeRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() != SalaryChangeRequest.RequestStatus.PENDING) {
            throw new RuntimeException("Request is not pending validation");
        }

        User rejectedBy = userRepository.findByUsername(rejectedByEmail)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        request.setStatus(SalaryChangeRequest.RequestStatus.REJECTED);
        request.setApprovedBy(rejectedBy);
        request.setApprovedAt(LocalDateTime.now());

        return mapToDTO(requestRepository.save(request));
    }

    private SalaryChangeRequestDTO mapToDTO(SalaryChangeRequest req) {
        return SalaryChangeRequestDTO.builder()
                .id(req.getId())
                .employeeId(req.getEmployee().getId())
                .employeeCode(req.getEmployee().getEmployeeCode())
                .employeeName(req.getEmployee().getFullName())
                .oldSalary(req.getOldSalary())
                .newSalary(req.getNewSalary())
                .reason(req.getReason())
                .status(req.getStatus())
                .requestedByName(req.getRequestedBy() != null ? req.getRequestedBy().getUsername() : null)
                .approvedByName(req.getApprovedBy() != null ? req.getApprovedBy().getUsername() : null)
                .createdAt(req.getCreatedAt())
                .approvedAt(req.getApprovedAt())
                .build();
    }
}
