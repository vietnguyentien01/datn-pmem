import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  // Use a hardcoded managerId for simplicity in this demo,
  // normally this comes from AuthService/LocalStorage
  currentManagerId = 2; // Manager's ID

  constructor(private snackBar: MatSnackBar, private leaveService: LeaveService) { }

  ngOnInit(): void {
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
