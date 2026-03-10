import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/services/auth.service';
import { LeaveService, LeaveRequest } from '../../../core/services/leave.service';

@Component({
  selector: 'app-leave-approval',
  templateUrl: './leave-approval.component.html',
  styleUrls: ['./leave-approval.component.css']
})
export class LeaveApprovalComponent implements OnInit {
  displayedColumns: string[] = ['employeeName', 'dates', 'type', 'status', 'actions'];
  dataSource = new MatTableDataSource<LeaveRequest>([]);
  statusFilter = 'PENDING';

  currentManagerId: number | null = null;

  constructor(
    private snackBar: MatSnackBar,
    private leaveService: LeaveService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user && user.employeeId) {
      this.currentManagerId = user.employeeId;
    }
    this.filterData();
  }

  filterData() {
    const statusParam = this.statusFilter === 'ALL' ? undefined : this.statusFilter;
    this.leaveService.getAll(statusParam).subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (err) => console.error('Lỗi tải danh sách nghỉ phép', err)
    });
  }

  updateStatus(id: number, status: 'APPROVED' | 'REJECTED') {
    let rejectReason = undefined;
    if (status === 'REJECTED') {
      const reason = prompt('Nhập lý do từ chối:');
      if (reason === null) return; // User cancelled
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
        this.snackBar.open('Có lỗi xảy ra', 'Đóng', { duration: 3000 });
      }
    });
  }
}
