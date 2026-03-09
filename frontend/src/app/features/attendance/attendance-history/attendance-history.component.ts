import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { AttendanceService, Attendance } from '../../../core/services/attendance.service';

@Component({
  selector: 'app-attendance-history',
  templateUrl: './attendance-history.component.html',
  styleUrls: ['./attendance-history.component.css']
})
export class AttendanceHistoryComponent implements OnInit {
  displayedColumns: string[] = ['date', 'checkIn', 'checkOut', 'status'];
  dataSource = new MatTableDataSource<Attendance>([]);
  selectedMonth: string = new Date().toISOString().substring(0, 7); // Default to current YYYY-MM

  // Use hardcoded employee ID for demo purposes
  currentEmployeeId = 3; // Employee

  constructor(private attendanceService: AttendanceService) { }

  ngOnInit(): void {
    this.loadAttendanceData();
  }

  loadAttendanceData() {
    if (!this.selectedMonth) return;

    // Convert YYYY-MM to exact start and end dates
    const [year, month] = this.selectedMonth.split('-');
    const startDate = `${year}-${month}-01`;
    // Get last day of month
    const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
    const endDate = `${year}-${month}-${lastDay}`;

    this.attendanceService.getAll(this.currentEmployeeId, startDate, endDate).subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (err) => console.error('Lỗi tải lịch sử chấm công', err)
    });
  }
}
