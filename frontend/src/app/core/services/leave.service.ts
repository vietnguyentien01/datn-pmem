import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LeaveRequest {
    id?: number;
    startDate?: string;
    endDate?: string;
    leaveType?: string;
    reason?: string;
    status?: string;
    rejectReason?: string;
    createdAt?: string;
    employee?: any;
    approvedBy?: any;
}

@Injectable({ providedIn: 'root' })
export class LeaveService {
    private api = `${environment.apiUrl}/leave`;

    constructor(private http: HttpClient) { }

    getMyRequests(employeeId: number): Observable<LeaveRequest[]> {
        return this.http.get<LeaveRequest[]>(`${this.api}/my/${employeeId}`);
    }

    getPending(): Observable<LeaveRequest[]> {
        return this.http.get<LeaveRequest[]>(`${this.api}/pending`);
    }

    getAll(status?: string, startDate?: string, endDate?: string, department?: string): Observable<LeaveRequest[]> {
        let params = new URLSearchParams();
        if (status) params.append('status', status);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (department) params.append('department', department);
        const query = params.toString() ? `?${params.toString()}` : '';
        return this.http.get<LeaveRequest[]>(`${this.api}/all${query}`);
    }

    submit(employeeId: number, data: LeaveRequest): Observable<LeaveRequest> {
        return this.http.post<LeaveRequest>(`${this.api}/request/${employeeId}`, data);
    }

    approve(requestId: number, managerId: number, approved: boolean, rejectReason?: string): Observable<LeaveRequest> {
        let url = `${this.api}/approve/${requestId}?managerId=${managerId}&approved=${approved}`;
        if (rejectReason) url += `&rejectReason=${encodeURIComponent(rejectReason)}`;
        return this.http.put<LeaveRequest>(url, {});
    }
}
