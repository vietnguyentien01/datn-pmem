import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Payroll {
    id?: number;
    month?: number;
    year?: number;
    baseSalary?: number;
    workingDays?: number;
    actualDays?: number;
    bonus?: number;
    deductions?: number;
    netSalary?: number;
    note?: string;
}

@Injectable({ providedIn: 'root' })
export class PayrollService {
    private api = `${environment.apiUrl}/payroll`;

    constructor(private http: HttpClient) { }

    getMyPayrolls(employeeId: number): Observable<Payroll[]> {
        return this.http.get<Payroll[]>(`${this.api}/my/${employeeId}`);
    }

    getMyPayrollByMonth(employeeId: number, year: number, month: number): Observable<Payroll> {
        return this.http.get<Payroll>(`${this.api}/my/${employeeId}/${year}/${month}`);
    }
}
