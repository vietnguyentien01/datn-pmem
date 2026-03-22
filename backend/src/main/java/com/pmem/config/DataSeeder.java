package com.pmem.config;

import com.pmem.model.*;
import com.pmem.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import java.util.List;

import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

        private final UserRepository userRepository;
        private final EmployeeRepository employeeRepository;
        private final PayrollRepository payrollRepository;
        private final PasswordEncoder passwordEncoder;
        private final JdbcTemplate jdbcTemplate;

        @Override
        @Transactional
        public void run(String... args) {
                log.info("🛠️ Đang kiểm tra và cập nhật ràng buộc cơ sở dữ liệu...");
                try {
                        // Drop the old check constraint that might not include 'HR'
                        jdbcTemplate.execute("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check");
                        log.info("✅ Đã loại bỏ ràng buộc 'users_role_check' cũ.");
                } catch (Exception e) {
                        log.warn("⚠️ Không thể loại bỏ ràng buộc (có thể nó không tồn tại): {}", e.getMessage());
                }

                if (!userRepository.existsByUsername("admin@pmem.vn")) {
                        log.info("📋 Bắt đầu khởi tạo dữ liệu mẫu...");

                        // Create Admin
                        User adminUser = userRepository.save(User.builder()
                                        .username("admin@pmem.vn")
                                        .password(passwordEncoder.encode("Admin@123"))
                                        .role(User.Role.ADMIN)
                                        .build());

                        Employee adminEmp = employeeRepository.save(Employee.builder()
                                        .employeeCode("MV000")
                                        .fullName("Hệ Thống Admin")
                                        .email("admin@pmem.vn")
                                        .phone("0123456789")
                                        .department("Ban Giám Đốc")
                                        .position("Quản Trị Viên")
                                        .gender("Nam")
                                        .baseSalary(30000000.0)
                                        .joinDate("2023-01-01")
                                        .status(Employee.EmployeeStatus.ACTIVE)
                                        .user(adminUser)
                                        .build());

                        // Create Manager
                        User managerUser = userRepository.save(User.builder()
                                        .username("manager@pmem.vn")
                                        .password(passwordEncoder.encode("Manager@123"))
                                        .role(User.Role.MANAGER)
                                        .build());

                        Employee manager = employeeRepository.save(Employee.builder()
                                        .employeeCode("MV005")
                                        .fullName("Trần Quản Lý")
                                        .email("manager@pmem.vn")
                                        .phone("0987654321")
                                        .department("Công Nghệ")
                                        .position("Trưởng Phòng")
                                        .gender("Nam")
                                        .baseSalary(25000000.0)
                                        .joinDate("2023-02-01")
                                        .status(Employee.EmployeeStatus.ACTIVE)
                                        .user(managerUser)
                                        .build());

                        // Create Employees
                        Employee emp1 = createSampleEmployee("NV001", "Nguyễn Văn A", "nv001@pmem.vn", "0912345678",
                                        "Kỹ thuật",
                                        "Lập trình viên", 15000000.0, "2023-03-01", User.Role.EMPLOYEE);
                        Employee emp2 = createSampleEmployee("NV002", "Trần Thị B", "nv002@pmem.vn", "0923456789",
                                        "Kinh doanh",
                                        "Nhân viên sale", 12000000.0, "2023-04-01", User.Role.EMPLOYEE);
                        Employee emp3 = createSampleEmployee("NV003", "Lê Văn C", "nv003@pmem.vn", "0934567890",
                                        "Kế toán",
                                        "Kế toán viên", 13000000.0, "2023-05-01", User.Role.EMPLOYEE);

                        // Seed Payroll for March 2026
                        createSamplePayroll(emp1, 3, 2026, 26, 25, 500000.0, 1000000.0);
                        createSamplePayroll(emp2, 3, 2026, 26, 24, 1000000.0, 2000000.0);
                        createSamplePayroll(emp3, 3, 2026, 26, 20, 300000.0, 500000.0);
                        createSamplePayroll(manager, 3, 2026, 26, 26, 2000000.0, 0.0);
                        createSamplePayroll(adminEmp, 3, 2026, 26, 26, 5000000.0, 0.0);
                } else {
                        log.info("Data đã được khởi tạo, bỏ qua seeding chính.");
                }

                // Reset/Seed HR user - LUÔN CHẠY
                userRepository.findByUsername("hr@pmem.vn").ifPresentOrElse(
                                user -> {
                                        user.setPassword(passwordEncoder.encode("Hr@123"));
                                        user.setRole(User.Role.HR);
                                        userRepository.save(user);
                                        log.info("   HR (Reset): hr@pmem.vn      / Hr@123");
                                },
                                () -> {
                                        User hrUser = userRepository.save(User.builder()
                                                        .username("hr@pmem.vn")
                                                        .password(passwordEncoder.encode("Hr@123"))
                                                        .role(User.Role.HR)
                                                        .build());

                                        Employee hrEmp = employeeRepository.save(Employee.builder()
                                                        .employeeCode("MV006")
                                                        .fullName("Bùi Nhân Sự")
                                                        .email("hr@pmem.vn")
                                                        .phone("0956789012")
                                                        .department("Nhân Sự")
                                                        .position("Chuyên Viên Nhân Sự")
                                                        .gender("Nữ")
                                                        .baseSalary(15000000.0)
                                                        .joinDate("2024-01-01")
                                                        .status(Employee.EmployeeStatus.ACTIVE)
                                                        .user(hrUser)
                                                        .build());
                                        log.info("   HR (New):   hr@pmem.vn      / Hr@123");
                                        createSamplePayroll(hrEmp, 3, 2026, 26, 26, 1000000.0, 0.0);
                                });

                log.info("✅ Kiểm tra/Khởi tạo dữ liệu hoàn tất!");
        }

        private Employee createSampleEmployee(String code, String name, String username, String phone, String dept,
                        String pos, double salary, String joinDate, User.Role role) {
                User user = userRepository.save(User.builder()
                                .username(username)
                                .password(passwordEncoder.encode(username.split("@")[0].substring(0, 1).toUpperCase()
                                                + username.split("@")[0].substring(1) + "@123"))
                                .role(role)
                                .build());

                return employeeRepository.save(Employee.builder()
                                .employeeCode(code)
                                .fullName(name)
                                .email(username)
                                .phone(phone)
                                .department(dept)
                                .position(pos)
                                .gender("Nam")
                                .baseSalary(salary)
                                .joinDate(joinDate)
                                .status(Employee.EmployeeStatus.ACTIVE)
                                .user(user)
                                .build());
        }

        private void createSamplePayroll(Employee emp, int month, int year, int workingDays, int actualDays,
                        double bonus, double deductions) {
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
