import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.css']
})
export class LeaveRequestComponent implements OnInit {
  leaveForm!: FormGroup;
  isSubmitting = false;

  history = [
    {
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-03-02'),
      type: 'Nghỉ ốm (Sick Leave)',
      reason: 'Bị cảm nhẹ',
      status: 'APPROVED'
    },
    {
      startDate: new Date('2024-03-15'),
      endDate: new Date('2024-03-16'),
      type: 'Nghỉ phép năm (Paid Leave)',
      reason: 'Việc gia đình',
      status: 'PENDING'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.leaveForm = this.fb.group({
      type: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.leaveForm.valid) {
      this.isSubmitting = true;

      const newRequest = {
        ...this.leaveForm.value,
        status: 'PENDING'
      };

      setTimeout(() => {
        this.history.unshift(newRequest);
        this.snackBar.open('Đã gửi yêu cầu nghỉ phép thành công', 'Đóng', { duration: 3000 });
        this.leaveForm.reset();
        Object.keys(this.leaveForm.controls).forEach(key => {
          this.leaveForm.get(key)?.setErrors(null);
        });
        this.isSubmitting = false;
      }, 800);
    }
  }
}
