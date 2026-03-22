import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { PayrollService, Payroll } from '../../../core/services/payroll.service';
import { EmployeeService, Employee } from '../../../core/services/employee.service';

@Component({
  selector: 'app-payroll-view',
  templateUrl: './payroll-view.component.html',
  styleUrls: ['./payroll-view.component.css']
})
export class PayrollViewComponent implements OnInit {
  payrolls: Payroll[] = [];
  currentPayroll: Payroll | null = null;
  employee: Employee | null = null;
  selectedIndex = 0;

  constructor(
    private authService: AuthService,
    private payrollService: PayrollService,
    private employeeService: EmployeeService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user && user.employeeId) {
      this.loadEmployee(user.employeeId);
      this.loadPayrolls(user.employeeId);
    }
  }

  loadEmployee(employeeId: number) {
    this.employeeService.getById(employeeId).subscribe({
      next: (data) => this.employee = data,
      error: (err) => console.error('Lỗi tải thông tin nhân viên', err)
    });
  }

  loadPayrolls(employeeId: number) {
    this.payrollService.getMyPayrolls(employeeId).subscribe({
      next: (data) => {
        this.payrolls = data;
        if (data.length > 0) {
          this.currentPayroll = data[0];
        }
      },
      error: (err) => console.error('Lỗi tải bảng lương', err)
    });
  }

  onMonthChange() {
    this.currentPayroll = this.payrolls[this.selectedIndex] || null;
  }

  get calculatedTotalIncome(): number {
    if (!this.employee || !this.currentPayroll) return 0;
    const base = this.employee.baseSalary || 0;
    const workingDays = this.currentPayroll.workingDays || 26;
    const actualDays = this.currentPayroll.actualDays || workingDays;
    const bonus = this.currentPayroll.bonus || 0;
    return (base / workingDays * actualDays) + bonus;
  }

  get calculatedDeductions(): number {
    if (!this.employee) return 0;
    const base = this.employee.baseSalary || 0;
    return base * 0.105;
  }

  get calculatedNetSalary(): number {
    return this.calculatedTotalIncome - this.calculatedDeductions;
  }
}
