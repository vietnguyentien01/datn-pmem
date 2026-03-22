package com.pmem.service;

import com.pmem.model.Certification;
import com.pmem.model.Employee;
import com.pmem.model.User;
import com.pmem.model.WorkHistory;
import com.pmem.repository.CertificationRepository;
import com.pmem.repository.EmployeeRepository;
import com.pmem.repository.UserRepository;
import com.pmem.repository.WorkHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CertificationRepository certificationRepository;
    private final WorkHistoryRepository workHistoryRepository;

    public List<Employee> getAllEmployees(String keyword, Employee.EmployeeStatus status, String department) {
        String searchKeyword = (keyword != null && !keyword.trim().isEmpty()) ? "%" + keyword.trim() + "%" : null;
        return employeeRepository.findEmployeesByKeyword(searchKeyword, status, department);
    }

    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với ID: " + id));
    }

    public Employee getEmployeeByUserId(Long userId) {
        return employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));
    }

    @Transactional
    public Employee createEmployee(Employee employee, String password) {
        User user = User.builder()
                .username(employee.getEmail())
                .password(passwordEncoder.encode(password))
                .role(User.Role.EMPLOYEE)
                .build();
        User savedUser = userRepository.save(user);

        employee.setEmployeeCode(generateNextEmployeeCode());
        employee.setUser(savedUser);
        employee.setStatus(Employee.EmployeeStatus.ACTIVE);

        return employeeRepository.save(employee);
    }

    @Transactional
    public Employee updateEmployee(Long id, Employee updatedData) {
        Employee existing = getEmployeeById(id);
        existing.setFullName(updatedData.getFullName());
        existing.setPhone(updatedData.getPhone());
        existing.setDepartment(updatedData.getDepartment());
        existing.setPosition(updatedData.getPosition());
        existing.setGender(updatedData.getGender());
        existing.setAddress(updatedData.getAddress());
        existing.setBaseSalary(updatedData.getBaseSalary());
        existing.setStatus(updatedData.getStatus());
        return employeeRepository.save(existing);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = getEmployeeById(id);
        employee.setStatus(Employee.EmployeeStatus.INACTIVE);
        employeeRepository.save(employee);
    }

    public List<String> getAllDepartments() {
        return employeeRepository.findDistinctDepartments();
    }

    // Certification CRUD
    public List<Certification> getCertifications(Long employeeId) {
        return certificationRepository.findByEmployeeIdOrderByIssueDateDesc(employeeId);
    }

    @Transactional
    public Certification addCertification(Long employeeId, Certification cert) {
        Employee employee = getEmployeeById(employeeId);
        cert.setEmployee(employee);
        return certificationRepository.save(cert);
    }

    @Transactional
    public void deleteCertification(Long certId) {
        certificationRepository.deleteById(certId);
    }

    // WorkHistory CRUD
    public List<WorkHistory> getWorkHistory(Long employeeId) {
        return workHistoryRepository.findByEmployeeIdOrderByStartDateDesc(employeeId);
    }

    @Transactional
    public WorkHistory addWorkHistory(Long employeeId, WorkHistory history) {
        Employee employee = getEmployeeById(employeeId);
        history.setEmployee(employee);
        return workHistoryRepository.save(history);
    }

    @Transactional
    public void deleteWorkHistory(Long historyId) {
        workHistoryRepository.deleteById(historyId);
    }

    public String generateNextEmployeeCode() {
        String maxCode = employeeRepository.findMaxEmployeeCode();
        int nextNumber = 1;
        if (maxCode != null && maxCode.startsWith("NV")) {
            try {
                nextNumber = Integer.parseInt(maxCode.substring(2)) + 1;
            } catch (NumberFormatException e) {
                // Nếu có lỗi parse, dùng count + 1 làm fallback
                nextNumber = (int) (employeeRepository.count() + 1);
            }
        }
        return "NV" + String.format("%03d", nextNumber);
    }
}
