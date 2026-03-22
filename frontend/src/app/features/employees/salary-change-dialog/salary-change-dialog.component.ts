import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SalaryChangeService } from '../../../core/services/salary-change.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-salary-change-dialog',
  templateUrl: './salary-change-dialog.component.html',
  styleUrls: ['./salary-change-dialog.component.css']
})
export class SalaryChangeDialogComponent implements OnInit {
  form: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SalaryChangeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employeeId: number, employeeName: string, currentSalary: number },
    private salaryChangeService: SalaryChangeService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      newSalary: [data.currentSalary, [Validators.required, Validators.min(1000)]],
      reason: ['', Validators.required]
    });
  }

  ngOnInit(): void { }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      const val = this.form.value;
      this.salaryChangeService.createRequest(this.data.employeeId, val.newSalary, val.reason).subscribe({
        next: (res) => {
          this.snackBar.open('Đã gửi đề xuất đổi lương thành công chạy đến Admin', 'Đóng', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.isLoading = false;
          let msg = 'Có lỗi xảy ra khi gửi đề xuất';
          if (err.error && err.error.message) msg = err.error.message;
          this.snackBar.open(msg, 'Đóng', { duration: 3000 });
        }
      });
    }
  }
}

