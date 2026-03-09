package com.pmem.service;

import com.pmem.model.Employee;
import com.pmem.model.Payroll;
import com.pmem.repository.EmployeeRepository;
import com.pmem.repository.PayrollRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PayrollService {

    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;

    public List<Payroll> getMyPayrolls(Long employeeId) {
        return payrollRepository.findByEmployeeIdOrderByYearDescMonthDesc(employeeId);
    }

    public List<Payroll> getPayrollByMonthYear(Integer month, Integer year) {
        return payrollRepository.findByMonthAndYear(month, year);
    }

    public Payroll getMyPayrollByMonth(Long employeeId, Integer month, Integer year) {
        return payrollRepository.findByEmployeeIdAndMonthAndYear(employeeId, month, year)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bảng lương tháng " + month + "/" + year));
    }

    @Transactional
    public Payroll createOrUpdatePayroll(Long employeeId, Payroll payrollData) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));

        Payroll payroll = payrollRepository
                .findByEmployeeIdAndMonthAndYear(employeeId, payrollData.getMonth(), payrollData.getYear())
                .orElse(Payroll.builder().employee(employee).build());

        payroll.setMonth(payrollData.getMonth());
        payroll.setYear(payrollData.getYear());
        payroll.setBaseSalary(employee.getBaseSalary());
        payroll.setWorkingDays(payrollData.getWorkingDays());
        payroll.setActualDays(payrollData.getActualDays());
        payroll.setBonus(payrollData.getBonus() != null ? payrollData.getBonus() : 0.0);
        payroll.setDeductions(payrollData.getDeductions() != null ? payrollData.getDeductions() : 0.0);

        // Calculate net salary
        double dailyRate = employee.getBaseSalary()
                / (payrollData.getWorkingDays() > 0 ? payrollData.getWorkingDays() : 26);
        double earnedSalary = dailyRate
                * (payrollData.getActualDays() != null ? payrollData.getActualDays() : payrollData.getWorkingDays());
        payroll.setNetSalary(earnedSalary + payroll.getBonus() - payroll.getDeductions());
        payroll.setNote(payrollData.getNote());

        return payrollRepository.save(payroll);
    }
}
