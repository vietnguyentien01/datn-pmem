import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WorkScheduleService, WorkSchedule } from '../../../core/services/work-schedule.service';

@Component({
    selector: 'app-work-schedule',
    templateUrl: './work-schedule.component.html',
    styleUrls: ['./work-schedule.component.css']
})
export class WorkScheduleComponent implements OnInit {
    schedule: WorkSchedule = {};
    isSaving = false;

    constructor(
        private workScheduleService: WorkScheduleService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.loadSchedule();
    }

    loadSchedule() {
        this.workScheduleService.getSchedule().subscribe({
            next: (data) => this.schedule = data,
            error: (err) => console.error('Lỗi tải cấu hình', err)
        });
    }

    save() {
        this.isSaving = true;
        this.workScheduleService.updateSchedule(this.schedule).subscribe({
            next: (data) => {
                this.schedule = data;
                this.snackBar.open('Đã lưu cấu hình giờ làm việc', 'Đóng', { duration: 3000 });
                this.isSaving = false;
            },
            error: (err) => {
                console.error('Lỗi lưu cấu hình', err);
                this.snackBar.open('Có lỗi xảy ra', 'Đóng', { duration: 3000 });
                this.isSaving = false;
            }
        });
    }
}
