import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface WorkSchedule {
    id?: number;
    standardCheckIn?: string;
    standardCheckOut?: string;
    lateThresholdMinutes?: number;
    earlyLeaveThresholdMinutes?: number;
}

@Injectable({ providedIn: 'root' })
export class WorkScheduleService {
    private api = `${environment.apiUrl}/work-schedule`;

    constructor(private http: HttpClient) { }

    getSchedule(): Observable<WorkSchedule> {
        return this.http.get<WorkSchedule>(this.api);
    }

    updateSchedule(schedule: WorkSchedule): Observable<WorkSchedule> {
        return this.http.put<WorkSchedule>(this.api, schedule);
    }
}
