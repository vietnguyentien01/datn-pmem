import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PayrollService, Payroll } from '../../../core/services/payroll.service';
import { EmployeeService, Employee } from '../../../core/services/employee.service';
import { SalaryChangeDialogComponent } from '../../employees/salary-change-dialog/salary-change-dialog.component';

@Component({
  selector: 'app-payroll-admin',
  templateUrl: './payroll-admin.component.html',
  styleUrls: ['./payroll-admin.component.css']
})
export class PayrollAdminComponent implements OnInit {
  displayedColumns: string[] = ['employeeCode', 'fullName', 'department', 'month', 'netSalary', 'status', 'actions'];
  employees: Employee[] = [];
  payrolls: Payroll[] = [];

  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();
  isLoading = false;

  constructor(
    private payrollService: PayrollService,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.employeeService.getAll().subscribe({
      next: (emps) => {
        this.employees = emps.filter(e => e.status === 'ACTIVE' && e.role !== 'ADMIN');
        this.loadPayrollsForMonth();
      },
      error: (err) => {
        console.error('Lỗi tải nhân viên', err);
        this.isLoading = false;
      }
    });
  }

  loadPayrollsForMonth(): void {
    this.payrollService.getAllPayrolls(this.selectedYear, this.selectedMonth).subscribe({
      next: (data) => {
        this.payrolls = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi tải bảng lương', err);
        this.isLoading = false;
      }
    });
  }

  onPeriodChange(): void {
    this.loadPayrollsForMonth();
  }

  getEmployeePayroll(employeeId: number): Payroll | undefined {
    return this.payrolls.find(p => p.employee?.id === employeeId);
  }

  generatePayroll(employee: Employee): void {
    const defaultPayroll = {
      month: this.selectedMonth,
      year: this.selectedYear,
      workingDays: 26,
      actualDays: 26,
      bonus: 0,
      deductions: 0
    };

    this.payrollService.createOrUpdatePayroll(employee.id!, defaultPayroll).subscribe({
      next: (newPayroll) => {
        this.snackBar.open(`Đã tạo bảng lương cho ${employee.fullName}`, 'Đóng', { duration: 3000 });
        this.loadPayrollsForMonth();
      },
      error: (err) => {
        console.error('Lỗi tạo bảng lương', err);
        this.snackBar.open('Có lỗi xảy ra', 'Đóng', { duration: 3000 });
      }
    });
  }

  generateAll(): void {
    let completed = 0;
    const empsToProcess = this.employees.filter(e => !this.getEmployeePayroll(e.id!));
    if (empsToProcess.length === 0) {
      this.snackBar.open('Tất cả nhân viên đã có bảng lương tháng này', 'Đóng', { duration: 3000 });
      return;
    }

    empsToProcess.forEach(emp => {
      const defaultPayroll = {
        month: this.selectedMonth,
        year: this.selectedYear,
        workingDays: 26,
        actualDays: 26,
        bonus: 0,
        deductions: 0
      };

      this.payrollService.createOrUpdatePayroll(emp.id!, defaultPayroll).subscribe({
        next: () => {
          completed++;
          if (completed === empsToProcess.length) {
            this.snackBar.open(`Đã tạo bảng lương thành công`, 'Đóng', { duration: 3000 });
            this.loadPayrollsForMonth();
          }
        }
      });
    });
  }

  openSalaryChangeDialog(emp: Employee) {
    this.dialog.open(SalaryChangeDialogComponent, {
      width: '500px',
      data: {
        employeeId: emp.id,
        employeeName: emp.fullName,
        currentSalary: emp.baseSalary
      }
    });
  }
}
