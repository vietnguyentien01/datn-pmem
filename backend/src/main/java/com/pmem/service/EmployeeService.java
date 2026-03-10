package com.pmem.service;

import com.pmem.model.Employee;
import com.pmem.model.User;
import com.pmem.repository.EmployeeRepository;
import com.pmem.repository.UserRepository;
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

    public List<Employee> getAllEmployees(String keyword, Employee.EmployeeStatus status) {
        String searchKeyword = (keyword != null && !keyword.trim().isEmpty()) ? "%" + keyword.trim() + "%" : null;
        return employeeRepository.findEmployeesByKeyword(searchKeyword, status);
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
        // Create user account
        User user = User.builder()
                .username(employee.getEmail())
                .password(passwordEncoder.encode(password))
                .role(User.Role.EMPLOYEE)
                .build();
        User savedUser = userRepository.save(user);

        // Set employee code
        String code = "NV" + String.format("%03d", employeeRepository.count() + 1);
        employee.setEmployeeCode(code);
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
}
