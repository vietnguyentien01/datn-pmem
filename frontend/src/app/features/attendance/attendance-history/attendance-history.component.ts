import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AttendanceService, Attendance } from '../../../core/services/attendance.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-attendance-history',
  templateUrl: './attendance-history.component.html',
  styleUrls: ['./attendance-history.component.css']
})
export class AttendanceHistoryComponent implements OnInit {
  displayedColumns: string[] = ['date', 'checkIn', 'checkOut', 'status'];
  dataSource = new MatTableDataSource<Attendance>([]);

  // Filters
  startDate = '';
  endDate = '';
  selectedDepartment = '';
  searchEmployeeCode = '';
  departments: string[] = [];

  // Role-based
  isAdmin = false;
  isManager = false;
  isHR = false;
  currentEmployeeId: number | null = null;

  // Edit dialog
  editingRecord: Attendance | null = null;
  editCheckIn = '';
  editCheckOut = '';
  editStatus = '';
  editNote = '';

  constructor(
    private attendanceService: AttendanceService,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.isAdmin = user.role === 'ADMIN';
      this.isManager = user.role === 'MANAGER';
      this.isHR = user.role === 'HR';
      this.currentEmployeeId = user.employeeId;
    }

    if (this.isHR) {
      this.displayedColumns = ['employeeInfo', 'date', 'checkIn', 'checkOut', 'status', 'actions'];
      this.loadDepartments();
    }

    // Default to current month
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    this.startDate = `${year}-${month}-01`;
    const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
    this.endDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;

    this.loadAttendanceData();
  }

  loadDepartments() {
    this.employeeService.getDepartments().subscribe({
      next: (data) => this.departments = data,
      error: (err) => console.error('Lỗi tải phòng ban', err)
    });
  }

  loadAttendanceData() {
    if (this.isHR) {
      const dept = this.selectedDepartment || undefined;
      const empCode = this.searchEmployeeCode || undefined;
      const start = this.startDate || undefined;
      const end = this.endDate || undefined;
      this.attendanceService.getAll(undefined, start, end, dept, empCode).subscribe({
        next: (data) => this.dataSource.data = data,
        error: (err) => console.error('Lỗi tải lịch sử chấm công', err)
      });
    } else {
      if (this.currentEmployeeId) {
        const start = this.startDate;
        const end = this.endDate;
        if (start && end) {
          this.attendanceService.getMyAttendanceByRange(this.currentEmployeeId, start, end).subscribe({
            next: (data) => this.dataSource.data = data,
            error: (err) => console.error('Lỗi tải lịch sử chấm công cá nhân', err)
          });
        }
      }
    }
  }

  // Admin edit functions
  startEdit(record: Attendance) {
    this.editingRecord = record;
    this.editCheckIn = record.checkIn || '';
    this.editCheckOut = record.checkOut || '';
    this.editStatus = record.status || '';
    this.editNote = record.note || '';
  }

  cancelEdit() {
    this.editingRecord = null;
  }

  saveEdit() {
    if (!this.editingRecord || !this.editingRecord.id) return;
    this.attendanceService.updateAttendance(this.editingRecord.id, {
      checkIn: this.editCheckIn || null,
      checkOut: this.editCheckOut || null,
      status: this.editStatus || null,
      note: this.editNote || null
    }).subscribe({
      next: () => {
        this.snackBar.open('Đã cập nhật chấm công', 'Đóng', { duration: 3000 });
        this.editingRecord = null;
        this.loadAttendanceData();
      },
      error: (err) => {
        console.error('Lỗi cập nhật', err);
        this.snackBar.open('Có lỗi xảy ra', 'Đóng', { duration: 3000 });
      }
    });
  }
}
