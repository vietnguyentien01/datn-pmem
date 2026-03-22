import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AttendanceService, AttendanceSummary } from '../../../core/services/attendance.service';
import { EmployeeService } from '../../../core/services/employee.service';


@Component({
    selector: 'app-attendance-summary',
    templateUrl: './attendance-summary.component.html',
    styleUrls: ['./attendance-summary.component.css']
})
export class AttendanceSummaryComponent implements OnInit {
    displayedColumns: string[] = ['employeeCode', 'fullName', 'department', 'presentDays', 'lateDays', 'absentDays', 'leaveDays', 'totalWorkHours'];
    dataSource = new MatTableDataSource<AttendanceSummary>([]);

    departments: string[] = [];
    selectedDepartment = '';
    startDate = '';
    endDate = '';

    constructor(
        private attendanceService: AttendanceService,
        private employeeService: EmployeeService
    ) { }

    ngOnInit(): void {
        // Default to current month
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        this.startDate = `${year}-${month}-01`;
        const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
        this.endDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;

        this.loadDepartments();
        this.loadSummary();
    }

    loadDepartments() {
        this.employeeService.getDepartments().subscribe({
            next: (data) => this.departments = data,
            error: (err) => console.error('Lỗi tải phòng ban', err)
        });
    }

    loadSummary() {
        const dept = this.selectedDepartment || undefined;
        const start = this.startDate || undefined;
        const end = this.endDate || undefined;
        this.attendanceService.getSummary(dept, start, end).subscribe({
            next: (data) => this.dataSource.data = data,
            error: (err) => console.error('Lỗi tải tổng hợp chấm công', err)
        });
    }

    exportToExcel() {
        const title = 'BÁO CÁO TỔNG HỢP CHẤM CÔNG';
        const dateRange = `Từ ngày: ${this.startDate} - Đến ngày: ${this.endDate}`;

        let html = `
        <html xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head>
            <meta charset="utf-8">
            <!--[if gte mso 9]>
            <xml>
                <x:ExcelWorkbook>
                    <x:ExcelWorksheets>
                        <x:ExcelWorksheet>
                            <x:Name>Bao Cao Cham Cong</x:Name>
                            <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
                        </x:ExcelWorksheet>
                    </x:ExcelWorksheets>
                </x:ExcelWorkbook>
            </xml>
            <![endif]-->
        </head>
        <body>
            <h2 style="font-family: Arial, sans-serif;">${title}</h2>
            <p style="font-family: Arial, sans-serif;">${dateRange}</p>
            <table border="1" cellpadding="5" cellspacing="0" style="font-family: Arial, sans-serif; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="background-color: #3f51b5; color: white;">Mã NV</th>
                        <th style="background-color: #3f51b5; color: white;">Họ tên</th>
                        <th style="background-color: #3f51b5; color: white;">Phòng ban</th>
                        <th style="background-color: #3f51b5; color: white;">Đi làm</th>
                        <th style="background-color: #3f51b5; color: white;">Muộn/Sớm</th>
                        <th style="background-color: #3f51b5; color: white;">Nghỉ</th>
                        <th style="background-color: #3f51b5; color: white;">Phép</th>
                        <th style="background-color: #3f51b5; color: white;">Số giờ</th>
                    </tr>
                </thead>
                <tbody>
        `;

        this.dataSource.data.forEach(item => {
            html += `
                <tr>
                    <td style="text-align: center;">${item.employeeCode}</td>
                    <td>${item.fullName}</td>
                    <td style="text-align: center;">${item.department || '-'}</td>
                    <td style="text-align: right;">${item.presentDays}</td>
                    <td style="text-align: right;">${item.lateDays}</td>
                    <td style="text-align: right;">${item.absentDays}</td>
                    <td style="text-align: right;">${item.leaveDays}</td>
                    <td style="text-align: right;">${item.totalWorkHours.toFixed(1)}</td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        </body>
        </html>
        `;

        const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `Bao_cao_cham_cong_${this.startDate}_${this.endDate}.xls`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
