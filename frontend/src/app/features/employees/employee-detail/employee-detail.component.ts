import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent implements OnInit {
  employeeForm!: FormGroup;
  isNew = false;
  employeeId: string | null = null;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    this.isNew = this.employeeId === 'new';

    this.employeeForm = this.fb.group({
      employeeCode: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      department: ['', Validators.required],
      position: [''],
      salary: [0]
    });

    if (!this.isNew) {
      this.loadEmployeeData();
    }
  }

  loadEmployeeData() {
    // Gọi API lấy data nhân viên
    // Dummy temp implementation
    if (this.employeeId === '1') {
      this.employeeForm.patchValue({
        employeeCode: 'NV001',
        fullName: 'Nguyễn Văn Admin',
        email: 'admin@pmem.vn',
        department: 'Ban Giám Đốc',
        position: 'Giám đốc',
        salary: 50000000
      });
    }
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      this.isSaving = true;
      // Gọi API lưu hoặc cập nhật hồ sơ
      setTimeout(() => {
        this.snackBar.open(this.isNew ? 'Thêm nhân viên thành công' : 'Cập nhật thành công', 'Đóng', { duration: 3000 });
        this.isSaving = false;
        this.router.navigate(['/employees']);
      }, 800);
    }
  }
}
