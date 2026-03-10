import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/services/auth.service';
import { LeaveService, LeaveRequest } from '../../../core/services/leave.service';

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.css']
})
export class LeaveRequestComponent implements OnInit {
  leaveForm!: FormGroup;
  isSubmitting = false;
  history: LeaveRequest[] = [];
  currentEmployeeId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private leaveService: LeaveService
  ) { }

  ngOnInit(): void {
    this.leaveForm = this.fb.group({
      leaveType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', Validators.required]
    });

    const user = this.authService.getCurrentUser();
    if (user && user.employeeId) {
      this.currentEmployeeId = user.employeeId;
      this.loadMyRequests();
    }
  }

  loadMyRequests(): void {
    if (!this.currentEmployeeId) return;
    this.leaveService.getMyRequests(this.currentEmployeeId).subscribe({
      next: (data) => this.history = data,
      error: (err) => console.error('Lỗi tải lịch sử nghỉ phép', err)
    });
  }

  onSubmit() {
    if (this.leaveForm.valid && this.currentEmployeeId) {
      this.isSubmitting = true;

      const newRequest: LeaveRequest = {
        leaveType: this.leaveForm.value.leaveType,
        startDate: new Date(this.leaveForm.value.startDate).toISOString().split('T')[0],
        endDate: new Date(this.leaveForm.value.endDate).toISOString().split('T')[0],
        reason: this.leaveForm.value.reason
      };

      this.leaveService.submit(this.currentEmployeeId, newRequest).subscribe({
        next: (res) => {
          this.snackBar.open('Đã gửi yêu cầu nghỉ phép thành công', 'Đóng', { duration: 3000 });
          this.leaveForm.reset();
          Object.keys(this.leaveForm.controls).forEach(key => {
            this.leaveForm.get(key)?.setErrors(null);
          });
          this.loadMyRequests(); // Reload history
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Lỗi khi xin nghỉ phép', err);
          this.snackBar.open('Đã có lỗi xảy ra', 'Đóng', { duration: 3000 });
          this.isSubmitting = false;
        }
      });
    }
  }
}
