import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '../../../core/services/auth.service';
import { LeaveService, LeaveRequest } from '../../../core/services/leave.service';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-leave-approval',
  templateUrl: './leave-approval.component.html',
  styleUrls: ['./leave-approval.component.css']
})
export class LeaveApprovalComponent implements OnInit {
  displayedColumns: string[] = ['employeeName', 'dates', 'type', 'status', 'actions'];
  dataSource = new MatTableDataSource<LeaveRequest>([]);
  statusFilter = 'PENDING';
  departmentFilter = '';
  departments: string[] = [];

  currentManagerId: number | null = null;
  currentUserRole: string = '';

  @ViewChild('reasonDialog') reasonDialog!: TemplateRef<any>;

  constructor(
    private snackBar: MatSnackBar,
    private leaveService: LeaveService,
    private authService: AuthService,
    private employeeService: EmployeeService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user && user.employeeId) {
      this.currentManagerId = user.employeeId;
    }
    this.loadDepartments();
    this.filterData();
  }

  loadDepartments() {
    this.employeeService.getDepartments().subscribe({
      next: (data) => this.departments = data,
      error: (err) => console.error('Lỗi tải phòng ban', err)
    });
  }

  filterData() {
    const statusParam = this.statusFilter === 'ALL' ? undefined : this.statusFilter;
    const deptParam = this.departmentFilter || undefined;
    this.leaveService.getAll(statusParam, undefined, undefined, deptParam).subscribe({
      next: (data) => {
        // Ẩn đi các đơn xin nghỉ phép của chính người đang đăng nhập
        if (this.currentManagerId) {
          this.dataSource.data = data.filter(req => req.employee?.id !== this.currentManagerId);
        } else {
          this.dataSource.data = data;
        }
      },
      error: (err) => console.error('Lỗi tải danh sách nghỉ phép', err)
    });
  }

  updateStatus(id: number, status: 'APPROVED' | 'REJECTED') {
    let rejectReason = undefined;
    if (status === 'REJECTED') {
      const reason = prompt('Nhập lý do từ chối:');
      if (reason === null) return;
      rejectReason = reason;
    }

    if (!this.currentManagerId) {
      this.snackBar.open('Không tìm thấy thông tin Quản lý', 'Đóng', { duration: 3000 });
      return;
    }

    this.leaveService.approve(id, this.currentManagerId, status === 'APPROVED', rejectReason).subscribe({
      next: () => {
        this.filterData();
        this.snackBar.open(`Đã ${status === 'APPROVED' ? 'duyệt' : 'từ chối'} yêu cầu thành công`, 'Đóng', { duration: 3000 });
      },
      error: (err) => {
        console.error('Lỗi khi duyệt', err);
        const errorMessage = err.error?.message || 'Có lỗi xảy ra khi duyệt yêu cầu';
        this.snackBar.open(errorMessage, 'Đóng', { duration: 5000 });
      }
    });
  }

  viewReason(reason: string) {
    this.dialog.open(this.reasonDialog, {
      width: '400px',
      data: { reason }
    });
  }
}
