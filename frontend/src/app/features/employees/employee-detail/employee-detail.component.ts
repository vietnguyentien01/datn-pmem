import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService, Employee, Certification, WorkHistoryItem } from '../../../core/services/employee.service';
import { AuthService } from '../../../core/services/auth.service';

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
  activeTab = 0;
  isMe = false;
  isAdmin = false;
  isHR = false;

  // Certifications
  certifications: Certification[] = [];
  newCert: Certification = { name: '' };

  // Work History
  workHistories: WorkHistoryItem[] = [];
  newHistory: WorkHistoryItem = {};

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private employeeService: EmployeeService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');

    if (!this.employeeId && this.router.url.includes('/me')) {
      this.employeeId = 'me';
    }

    if (this.employeeId === 'me') {
      this.isMe = true;
      const user = this.authService.getCurrentUser();
      if (user && user.employeeId) {
        this.employeeId = user.employeeId.toString();
      }
    }

    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.role === 'ADMIN') {
      this.isAdmin = true;
    }
    if (currentUser && currentUser.role === 'HR') {
      this.isHR = true;
    }

    this.isNew = !this.employeeId || this.employeeId === 'new';
    const codeValue = this.isNew ? 'Hệ thống tự sinh' : '';

    this.employeeForm = this.fb.group({
      employeeCode: [codeValue, this.isNew ? [] : [Validators.required]],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      department: ['', Validators.required],
      position: [''],
      salary: [0],
      password: ['', this.isNew ? [Validators.required, Validators.minLength(6)] : []]
    });

    if (!this.isNew && this.employeeId) {
      this.loadEmployeeData();
      this.loadCertifications();
      this.loadWorkHistory();
    } else if (this.isNew) {
      this.employeeService.getNextCode().subscribe({
        next: (res) => this.employeeForm.patchValue({ employeeCode: res.code }),
        error: (err) => console.error('Lỗi lấy mã NV tiếp theo', err)
      });
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
        const pwd = this.employeeForm.value.password;
        this.employeeService.create(empData, pwd).subscribe({
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

  // Certifications
  loadCertifications() {
    const id = Number(this.employeeId);
    if (isNaN(id)) return;
    this.employeeService.getCertifications(id).subscribe({
      next: (data) => this.certifications = data,
      error: (err) => console.error('Lỗi tải bằng cấp', err)
    });
  }

  addCertification() {
    const id = Number(this.employeeId);
    if (isNaN(id) || !this.newCert.name) return;
    this.employeeService.addCertification(id, this.newCert).subscribe({
      next: () => {
        this.snackBar.open('Thêm bằng cấp/chứng chỉ thành công', 'Đóng', { duration: 3000 });
        this.newCert = { name: '' };
        this.loadCertifications();
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Lỗi thêm bằng cấp', 'Đóng', { duration: 3000 });
      }
    });
  }

  deleteCertification(certId: number) {
    if (!confirm('Xóa bằng cấp/chứng chỉ này?')) return;
    this.employeeService.deleteCertification(certId).subscribe({
      next: () => {
        this.loadCertifications();
        this.snackBar.open('Đã xóa', 'Đóng', { duration: 2000 });
      },
      error: (err) => console.error(err)
    });
  }

  // Work History
  loadWorkHistory() {
    const id = Number(this.employeeId);
    if (isNaN(id)) return;
    this.employeeService.getWorkHistory(id).subscribe({
      next: (data) => this.workHistories = data,
      error: (err) => console.error('Lỗi tải lịch sử công tác', err)
    });
  }

  addWorkHistory() {
    const id = Number(this.employeeId);
    if (isNaN(id)) return;
    this.employeeService.addWorkHistory(id, this.newHistory).subscribe({
      next: () => {
        this.snackBar.open('Thêm lịch sử công tác thành công', 'Đóng', { duration: 3000 });
        this.newHistory = {};
        this.loadWorkHistory();
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Lỗi thêm lịch sử công tác', 'Đóng', { duration: 3000 });
      }
    });
  }

  deleteWorkHistory(historyId: number) {
    if (!confirm('Xóa lịch sử công tác này?')) return;
    this.employeeService.deleteWorkHistory(historyId).subscribe({
      next: () => {
        this.loadWorkHistory();
        this.snackBar.open('Đã xóa', 'Đóng', { duration: 2000 });
      },
      error: (err) => console.error(err)
    });
  }
}
