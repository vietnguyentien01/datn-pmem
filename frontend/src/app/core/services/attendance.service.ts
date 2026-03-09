import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Attendance {
    id?: number;
    date?: string;
    checkIn?: string;
    checkOut?: string;
    status?: string;
    note?: string;
}

export interface AttendanceStatus {
    hasCheckedIn: boolean;
    hasCheckedOut: boolean;
    checkIn?: string;
    checkOut?: string;
    status?: string;
}

@Injectable({ providedIn: 'root' })
export class AttendanceService {
    private api = `${environment.apiUrl}/attendance`;

    constructor(private http: HttpClient) { }

    getMyAttendance(employeeId: number): Observable<Attendance[]> {
        return this.http.get<Attendance[]>(`${this.api}/my/${employeeId}`);
    }

    getTodayStatus(employeeId: number): Observable<AttendanceStatus> {
        return this.http.get<AttendanceStatus>(`${this.api}/today/${employeeId}`);
    }

    getTodayAll(): Observable<Attendance[]> {
        return this.http.get<Attendance[]>(`${this.api}/today`);
    }

    getAll(employeeId?: number, startDate?: string, endDate?: string): Observable<Attendance[]> {
        let params = new URLSearchParams();
        if (employeeId) params.append('employeeId', employeeId.toString());
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        const query = params.toString() ? `?${params.toString()}` : '';
        return this.http.get<Attendance[]>(`${this.api}/all${query}`);
    }

    checkIn(employeeId: number): Observable<Attendance> {
        return this.http.post<Attendance>(`${this.api}/checkin/${employeeId}`, {});
    }

    checkOut(employeeId: number): Observable<Attendance> {
        return this.http.post<Attendance>(`${this.api}/checkout/${employeeId}`, {});
    }
}
