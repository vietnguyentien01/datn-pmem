import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeService, Employee } from '../../../core/services/employee.service';
import { SalaryChangeDialogComponent } from '../salary-change-dialog/salary-change-dialog.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  displayedColumns: string[] = ['employeeCode', 'fullName', 'email', 'department', 'actions'];
  dataSource = new MatTableDataSource<Employee>([]);
  isAdmin = false;

  departments: string[] = [];
  selectedDepartment = '';
  searchKeyword = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user && user.role === 'ADMIN') {
      this.isAdmin = true;
    }
    this.loadDepartments();
    this.loadEmployees();
  }

  loadDepartments() {
    this.employeeService.getDepartments().subscribe({
      next: (data) => this.departments = data,
      error: (err) => console.error('Lỗi tải phòng ban', err)
    });
  }

  loadEmployees() {
    const keyword = this.searchKeyword || undefined;
    const dept = this.selectedDepartment || undefined;
    this.employeeService.getAll(keyword, undefined, dept).subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (err) => console.error('Lỗi tải danh sách nhân viên', err)
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    this.searchKeyword = (event.target as HTMLInputElement).value.trim();
    this.loadEmployees();
  }

  onDepartmentChange() {
    this.loadEmployees();
  }

  deleteEmployee(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      this.employeeService.delete(id).subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: (err) => console.error('Lỗi khi xóa nhân viên', err)
      });
    }
  }

  openSalaryChangeDialog(emp: Employee) {
    const dialogRef = this.dialog.open(SalaryChangeDialogComponent, {
      width: '500px',
      data: {
        employeeId: emp.id,
        employeeName: emp.fullName,
        currentSalary: emp.baseSalary
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Optional: reload data or do something
      }
    });
  }
}
