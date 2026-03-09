package com.pmem.config;

import com.pmem.model.*;
import com.pmem.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PayrollRepository payrollRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.existsByUsername("admin@pmem.vn")) {
            log.info("Data đã được khởi tạo, bỏ qua seeding.");
            return;
        }
        log.info("Bắt đầu khởi tạo dữ liệu mẫu...");

        // Create Admin user
        User adminUser = userRepository.save(User.builder()
                .username("admin@pmem.vn")
                .password(passwordEncoder.encode("Admin@123"))
                .role(User.Role.ADMIN)
                .build());

        Employee admin = employeeRepository.save(Employee.builder()
                .employeeCode("NV001")
                .fullName("Nguyễn Quản Trị")
                .email("admin@pmem.vn")
                .phone("0901234567")
                .department("Ban Giám Đốc")
                .position("Quản Trị Hệ Thống")
                .gender("Nam")
                .baseSalary(25000000.0)
                .joinDate("2020-01-01")
                .status(Employee.EmployeeStatus.ACTIVE)
                .user(adminUser)
                .build());

        // Create Manager user
        User managerUser = userRepository.save(User.builder()
                .username("manager@pmem.vn")
                .password(passwordEncoder.encode("Manager@123"))
                .role(User.Role.MANAGER)
                .build());

        Employee manager = employeeRepository.save(Employee.builder()
                .employeeCode("NV002")
                .fullName("Trần Quản Lý")
                .email("manager@pmem.vn")
                .phone("0912345678")
                .department("Nhân Sự")
                .position("Trưởng Phòng Nhân Sự")
                .gender("Nữ")
                .baseSalary(18000000.0)
                .joinDate("2021-03-15")
                .status(Employee.EmployeeStatus.ACTIVE)
                .user(managerUser)
                .build());

        // Create Employee 1
        User emp1User = userRepository.save(User.builder()
                .username("nv001@pmem.vn")
                .password(passwordEncoder.encode("Nv001@123"))
                .role(User.Role.EMPLOYEE)
                .build());

        Employee emp1 = employeeRepository.save(Employee.builder()
                .employeeCode("NV003")
                .fullName("Lê Văn An")
                .email("nv001@pmem.vn")
                .phone("0923456789")
                .department("Công Nghệ Thông Tin")
                .position("Lập Trình Viên")
                .gender("Nam")
                .baseSalary(12000000.0)
                .joinDate("2022-06-01")
                .status(Employee.EmployeeStatus.ACTIVE)
                .user(emp1User)
                .build());

        // Create Employee 2
        User emp2User = userRepository.save(User.builder()
                .username("nv002@pmem.vn")
                .password(passwordEncoder.encode("Nv002@123"))
                .role(User.Role.EMPLOYEE)
                .build());

        Employee emp2 = employeeRepository.save(Employee.builder()
                .employeeCode("NV004")
                .fullName("Phạm Thị Bình")
                .email("nv002@pmem.vn")
                .phone("0934567890")
                .department("Kế Toán")
                .position("Kế Toán Viên")
                .gender("Nữ")
                .baseSalary(10000000.0)
                .joinDate("2023-01-10")
                .status(Employee.EmployeeStatus.ACTIVE)
                .user(emp2User)
                .build());

        // Create Employee 3
        User emp3User = userRepository.save(User.builder()
                .username("nv003@pmem.vn")
                .password(passwordEncoder.encode("Nv003@123"))
                .role(User.Role.EMPLOYEE)
                .build());

        Employee emp3 = employeeRepository.save(Employee.builder()
                .employeeCode("NV005")
                .fullName("Hoàng Minh Cường")
                .email("nv003@pmem.vn")
                .phone("0945678901")
                .department("Công Nghệ Thông Tin")
                .position("Kỹ Sư Hệ Thống")
                .gender("Nam")
                .baseSalary(14000000.0)
                .joinDate("2022-09-20")
                .status(Employee.EmployeeStatus.ACTIVE)
                .user(emp3User)
                .build());

        // Seed sample payrolls for March 2026
        createSamplePayroll(emp1, 3, 2026, 26, 24, 500000.0, 0.0);
        createSamplePayroll(emp2, 3, 2026, 26, 26, 200000.0, 0.0);
        createSamplePayroll(emp3, 3, 2026, 26, 20, 300000.0, 500000.0);
        createSamplePayroll(manager, 3, 2026, 26, 26, 2000000.0, 0.0);

        log.info("✅ Khởi tạo dữ liệu mẫu thành công!");
        log.info("📋 Tài khoản mẫu:");
        log.info("   Admin:   admin@pmem.vn   / Admin@123");
        log.info("   Manager: manager@pmem.vn / Manager@123");
        log.info("   NV001:   nv001@pmem.vn   / Nv001@123");
        log.info("   NV002:   nv002@pmem.vn   / Nv002@123");
        log.info("   NV003:   nv003@pmem.vn   / Nv003@123");
    }

    private void createSamplePayroll(Employee emp, int month, int year, int workingDays, int actualDays, double bonus,
            double deductions) {
        double baseSalary = emp.getBaseSalary();
        double dailyRate = baseSalary / workingDays;
        double earned = dailyRate * actualDays;
        double net = earned + bonus - deductions;

        payrollRepository.save(Payroll.builder()
                .employee(emp)
                .month(month)
                .year(year)
                .baseSalary(baseSalary)
                .workingDays(workingDays)
                .actualDays(actualDays)
                .bonus(bonus)
                .deductions(deductions)
                .netSalary(net)
                .build());
    }
}
