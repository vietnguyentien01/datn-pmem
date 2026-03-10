import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/services/auth.service';
import { AttendanceService } from '../../../core/services/attendance.service';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})
export class CheckinComponent implements OnInit, OnDestroy {
  currentTime = new Date();
  timer: any;

  hasCheckedIn = false;
  hasCheckedOut = false;
  checkInTime = '';
  checkOutTime = '';
  isProcessing = false;
  currentEmployeeId: number | null = null;

  constructor(
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private attendanceService: AttendanceService
  ) { }

  ngOnInit(): void {
    this.timer = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);

    const user = this.authService.getCurrentUser();
    if (user && user.employeeId) {
      this.currentEmployeeId = user.employeeId;
      this.loadTodayStatus();
    }
  }

  loadTodayStatus(): void {
    if (!this.currentEmployeeId) return;
    this.attendanceService.getTodayStatus(this.currentEmployeeId).subscribe({
      next: (status) => {
        this.hasCheckedIn = status.hasCheckedIn;
        this.hasCheckedOut = status.hasCheckedOut;
        if (status.checkIn) {
          const ci = new Date(status.checkIn);
          this.checkInTime = ci.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        }
        if (status.checkOut) {
          const co = new Date(status.checkOut);
          this.checkOutTime = co.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        }
      },
      error: (err) => console.error('Lỗi tải trạng thái điểm danh hôm nay', err)
    });
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  onCheckIn(): void {
    if (!this.currentEmployeeId) return;
    this.isProcessing = true;
    this.attendanceService.checkIn(this.currentEmployeeId).subscribe({
      next: (res) => {
        if (res.checkIn) {
          const ci = new Date(res.checkIn);
          this.checkInTime = ci.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        }
        this.hasCheckedIn = true;
        this.isProcessing = false;
        this.snackBar.open('Check-in thành công!', 'Đóng', { duration: 3000 });
      },
      error: (err) => {
        console.error('Lỗi checkin', err);
        this.snackBar.open(err.error?.message || 'Lỗi Check-in', 'Đóng', { duration: 3000 });
        this.isProcessing = false;
      }
    });
  }

  onCheckOut(): void {
    if (!this.currentEmployeeId) return;
    this.isProcessing = true;
    this.attendanceService.checkOut(this.currentEmployeeId).subscribe({
      next: (res) => {
        if (res.checkOut) {
          const co = new Date(res.checkOut);
          this.checkOutTime = co.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        }
        this.hasCheckedOut = true;
        this.isProcessing = false;
        this.snackBar.open('Check-out thành công!', 'Đóng', { duration: 3000 });
      },
      error: (err) => {
        console.error('Lỗi checkOut', err);
        this.snackBar.open(err.error?.message || 'Lỗi Check-out', 'Đóng', { duration: 3000 });
        this.isProcessing = false;
      }
    });
  }
}
