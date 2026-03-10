import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService, Employee } from '../../../core/services/employee.service';

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
    private snackBar: MatSnackBar,
    private employeeService: EmployeeService
  ) { }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    this.isNew = !this.employeeId || this.employeeId === 'new';

    this.employeeForm = this.fb.group({
      employeeCode: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      department: ['', Validators.required],
      position: [''],
      salary: [0]
    });

    if (!this.isNew && this.employeeId) {
      this.loadEmployeeData();
    }
  }

  loadEmployeeData() {
    const id = Number(this.employeeId);
    if (isNaN(id)) return;

    this.employeeService.getById(id).subscribe({
      next: (data) => {
        this.employeeForm.patchValue({
          employeeCode: data.employeeCode,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          department: data.department,
          position: data.position,
          salary: data.baseSalary
        });
      },
      error: (err) => console.error('Lỗi lấy thông tin', err)
    });
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      this.isSaving = true;
      const empData: Employee = {
        employeeCode: this.employeeForm.value.employeeCode,
        fullName: this.employeeForm.value.fullName,
        email: this.employeeForm.value.email,
        phone: this.employeeForm.value.phone,
        department: this.employeeForm.value.department,
        position: this.employeeForm.value.position,
        baseSalary: this.employeeForm.value.salary,
        status: 'ACTIVE'
      };

      if (this.isNew) {
        this.employeeService.create(empData).subscribe({
          next: () => {
            this.snackBar.open('Thêm nhân viên thành công', 'Đóng', { duration: 3000 });
            this.isSaving = false;
            this.router.navigate(['/employees']);
          },
          error: (err) => {
            console.error(err);
            this.snackBar.open('Lỗi thêm nhân viên', 'Đóng', { duration: 3000 });
            this.isSaving = false;
          }
        });
      } else {
        this.employeeService.update(Number(this.employeeId), empData).subscribe({
          next: () => {
            this.snackBar.open('Cập nhật thành công', 'Đóng', { duration: 3000 });
            this.isSaving = false;
            this.router.navigate(['/employees']);
          },
          error: (err) => {
            console.error(err);
            this.snackBar.open('Lỗi cập nhật', 'Đóng', { duration: 3000 });
            this.isSaving = false;
          }
        });
      }
    }
  }
}
