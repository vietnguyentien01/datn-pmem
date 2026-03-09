import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { EmployeeService, Employee } from '../../../core/services/employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  displayedColumns: string[] = ['employeeCode', 'fullName', 'email', 'department', 'actions'];
  dataSource = new MatTableDataSource<Employee>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(keyword?: string) {
    this.employeeService.getAll(keyword).subscribe({
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
    const filterValue = (event.target as HTMLInputElement).value;
    // Debounce or filter directly
    this.loadEmployees(filterValue.trim());
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
}
