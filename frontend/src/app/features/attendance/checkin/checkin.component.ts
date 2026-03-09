import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.timer = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);

    // TODO: Call API to check today's attendance status
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  onCheckIn(): void {
    this.isProcessing = true;
    setTimeout(() => {
      const now = new Date();
      this.checkInTime = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      this.hasCheckedIn = true;
      this.isProcessing = false;
      this.snackBar.open('Check-in thành công!', 'Đóng', { duration: 3000 });
    }, 1000); // Simulate API latency
  }

  onCheckOut(): void {
    this.isProcessing = true;
    setTimeout(() => {
      const now = new Date();
      this.checkOutTime = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      this.hasCheckedOut = true;
      this.isProcessing = false;
      this.snackBar.open('Check-out thành công!', 'Đóng', { duration: 3000 });
    }, 1000); // Simulate API latency
  }
}
