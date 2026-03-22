import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SalaryChangeService, SalaryChangeRequest } from '../../../core/services/salary-change.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-salary-approval',
  templateUrl: './salary-approval.component.html',
  styleUrls: ['./salary-approval.component.css']
})
export class SalaryApprovalComponent implements OnInit {
  displayedColumns: string[] = ['employeeName', 'oldSalary', 'newSalary', 'reason', 'requestedByName', 'status', 'actions'];
  dataSource = new MatTableDataSource<SalaryChangeRequest>([]);
  isLoading = false;

  constructor(
    private salaryChangeService: SalaryChangeService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests() {
    this.isLoading = true;
    this.salaryChangeService.getAllRequests().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi tải danh sách đề xuất', err);
        this.isLoading = false;
      }
    });
  }

  approve(id: number) {
    if (confirm('Chấp thuận thay đổi mức lương này?')) {
      this.salaryChangeService.approveRequest(id).subscribe({
        next: () => {
          this.snackBar.open('Đã duyệt thành công', 'Đóng', { duration: 3000 });
          this.loadRequests();
        },
        error: (err) => {
          let msg = 'Lỗi duyệt';
          if (err.error && err.error.message) msg = err.error.message;
          this.snackBar.open(msg, 'Đóng', { duration: 3000 });
        }
      });
    }
  }

  reject(id: number) {
    if (confirm('Từ chối đề xuất này?')) {
      this.salaryChangeService.rejectRequest(id).subscribe({
        next: () => {
          this.snackBar.open('Đã từ chối đề xuất', 'Đóng', { duration: 3000 });
          this.loadRequests();
        },
        error: (err) => {
          let msg = 'Lỗi từ chối';
          if (err.error && err.error.message) msg = err.error.message;
          this.snackBar.open(msg, 'Đóng', { duration: 3000 });
        }
      });
    }
  }
}

