import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SalaryChangeRequest {
    id: number;
    employeeId: number;
    employeeCode: string;
    employeeName: string;
    oldSalary: number;
    newSalary: number;
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    requestedByName: string;
    approvedByName: string;
    createdAt: string;
    approvedAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class SalaryChangeService {
    private apiUrl = 'http://localhost:8080/api/salary-changes';

    constructor(private http: HttpClient) { }

    createRequest(employeeId: number, newSalary: number, reason: string): Observable<SalaryChangeRequest> {
        return this.http.post<SalaryChangeRequest>(`${this.apiUrl}/request`, { employeeId, newSalary, reason });
    }

    getAllRequests(): Observable<SalaryChangeRequest[]> {
        return this.http.get<SalaryChangeRequest[]>(`${this.apiUrl}/all`);
    }

    approveRequest(id: number): Observable<SalaryChangeRequest> {
        return this.http.put<SalaryChangeRequest>(`${this.apiUrl}/${id}/approve`, {});
    }

    rejectRequest(id: number): Observable<SalaryChangeRequest> {
        return this.http.put<SalaryChangeRequest>(`${this.apiUrl}/${id}/reject`, {});
    }
}
