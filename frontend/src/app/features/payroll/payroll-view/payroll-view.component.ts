import { Component, OnInit } from '@angular/core';

export interface Payslip {
  month: number;
  year: number;
  employeeName: string;
  employeeCode: string;
  department: string;
  position: string;
  baseSalary: number;
  workingDays: number;
  bonus: number;
  deductions: number;
  netSalary: number;
}

@Component({
  selector: 'app-payroll-view',
  templateUrl: './payroll-view.component.html',
  styleUrls: ['./payroll-view.component.css']
})
export class PayrollViewComponent implements OnInit {
  availableMonths = [
    { value: '03-2024', label: 'Tháng 03/2024' },
    { value: '02-2024', label: 'Tháng 02/2024' },
    { value: '01-2024', label: 'Tháng 01/2024' },
  ];
  selectedMonthStr = '03-2024';

  currentPayslip: Payslip | null = null;

  allPayslips: { [key: string]: Payslip } = {
    '03-2024': {
      month: 3, year: 2024,
      employeeName: 'Trần Thị Nhỏ', employeeCode: 'NV001',
      department: 'Phòng Kỹ Thuật', position: 'Nhân viên',
      baseSalary: 20000000, workingDays: 22,
      bonus: 1000000, deductions: 2100000, netSalary: 18900000
    },
    '02-2024': {
      month: 2, year: 2024,
      employeeName: 'Trần Thị Nhỏ', employeeCode: 'NV001',
      department: 'Phòng Kỹ Thuật', position: 'Nhân viên',
      baseSalary: 20000000, workingDays: 20,
      bonus: 500000, deductions: 2100000, netSalary: 18400000
    }
  };

  constructor() { }

  ngOnInit(): void {
    this.onMonthChange();
  }

  onMonthChange() {
    this.currentPayslip = this.allPayslips[this.selectedMonthStr] || null;
  }
}
