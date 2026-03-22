package com.pmem.controller;

import com.pmem.model.Certification;
import com.pmem.model.Employee;
import com.pmem.model.WorkHistory;
import com.pmem.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Employee.EmployeeStatus status,
            @RequestParam(required = false) String department) {
        return ResponseEntity.ok(employeeService.getAllEmployees(keyword, status, department));
    }

    @GetMapping("/departments")
    public ResponseEntity<List<String>> getDepartments() {
        return ResponseEntity.ok(employeeService.getAllDepartments());
    }

    @GetMapping("/next-code")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Map<String, String>> getNextCode() {
        return ResponseEntity.ok(Map.of("code", employeeService.generateNextEmployeeCode()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployee(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<Employee> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(employeeService.getEmployeeByUserId(userId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Employee> createEmployee(
            @RequestBody Employee employee,
            @RequestParam(defaultValue = "Nv@123456") String password) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(employeeService.createEmployee(employee, password));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody Employee employee) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, employee));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok(Map.of("message", "Đã vô hiệu hóa nhân viên thành công"));
    }

    // Certification endpoints
    @GetMapping("/{id}/certifications")
    public ResponseEntity<List<Certification>> getCertifications(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getCertifications(id));
    }

    @PostMapping("/{id}/certifications")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Certification> addCertification(@PathVariable Long id, @RequestBody Certification cert) {
        return ResponseEntity.status(HttpStatus.CREATED).body(employeeService.addCertification(id, cert));
    }

    @DeleteMapping("/certifications/{certId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Map<String, String>> deleteCertification(@PathVariable Long certId) {
        employeeService.deleteCertification(certId);
        return ResponseEntity.ok(Map.of("message", "Đã xóa bằng cấp/chứng chỉ"));
    }

    // WorkHistory endpoints
    @GetMapping("/{id}/work-history")
    public ResponseEntity<List<WorkHistory>> getWorkHistory(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getWorkHistory(id));
    }

    @PostMapping("/{id}/work-history")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<WorkHistory> addWorkHistory(@PathVariable Long id, @RequestBody WorkHistory history) {
        return ResponseEntity.status(HttpStatus.CREATED).body(employeeService.addWorkHistory(id, history));
    }

    @DeleteMapping("/work-history/{historyId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Map<String, String>> deleteWorkHistory(@PathVariable Long historyId) {
        employeeService.deleteWorkHistory(historyId);
        return ResponseEntity.ok(Map.of("message", "Đã xóa lịch sử công tác"));
    }
}
