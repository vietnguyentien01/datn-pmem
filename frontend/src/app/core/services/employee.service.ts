import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Employee {
    id?: number;
    employeeCode?: string;
    fullName: string;
    email: string;
    phone?: string;
    department?: string;
    position?: string;
    gender?: string;
    address?: string;
    baseSalary?: number;
    joinDate?: string;
    status?: string;
    role?: string;
}

export interface Certification {
    id?: number;
    name: string;
    issuedBy?: string;
    issueDate?: string;
    expiryDate?: string;
    certType?: string;
}

export interface WorkHistoryItem {
    id?: number;
    companyName?: string;
    position?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
    private api = `${environment.apiUrl}/employees`;

    constructor(private http: HttpClient) { }

    getAll(keyword?: string, status?: string, department?: string): Observable<Employee[]> {
        let params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (status) params.append('status', status);
        if (department) params.append('department', department);
        const query = params.toString() ? `?${params.toString()}` : '';
        return this.http.get<Employee[]>(`${this.api}${query}`);
    }

    getById(id: number): Observable<Employee> {
        return this.http.get<Employee>(`${this.api}/${id}`);
    }

    getDepartments(): Observable<string[]> {
        return this.http.get<string[]>(`${this.api}/departments`);
    }

    getNextCode(): Observable<{ code: string }> {
        return this.http.get<{ code: string }>(`${this.api}/next-code`);
    }

    create(emp: Employee, password?: string): Observable<Employee> {
        const params = password ? `?password=${password}` : '';
        return this.http.post<Employee>(`${this.api}${params}`, emp);
    }

    update(id: number, emp: Employee): Observable<Employee> {
        return this.http.put<Employee>(`${this.api}/${id}`, emp);
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.api}/${id}`);
    }

    // Certifications
    getCertifications(employeeId: number): Observable<Certification[]> {
        return this.http.get<Certification[]>(`${this.api}/${employeeId}/certifications`);
    }

    addCertification(employeeId: number, cert: Certification): Observable<Certification> {
        return this.http.post<Certification>(`${this.api}/${employeeId}/certifications`, cert);
    }

    deleteCertification(certId: number): Observable<any> {
        return this.http.delete(`${this.api}/certifications/${certId}`);
    }

    // Work History
    getWorkHistory(employeeId: number): Observable<WorkHistoryItem[]> {
        return this.http.get<WorkHistoryItem[]>(`${this.api}/${employeeId}/work-history`);
    }

    addWorkHistory(employeeId: number, history: WorkHistoryItem): Observable<WorkHistoryItem> {
        return this.http.post<WorkHistoryItem>(`${this.api}/${employeeId}/work-history`, history);
    }

    deleteWorkHistory(historyId: number): Observable<any> {
        return this.http.delete(`${this.api}/work-history/${historyId}`);
    }
}
