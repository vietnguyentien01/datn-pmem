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
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
    private api = `${environment.apiUrl}/employees`;

    constructor(private http: HttpClient) { }

    getAll(keyword?: string, status?: string): Observable<Employee[]> {
        let params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (status) params.append('status', status);
        const query = params.toString() ? `?${params.toString()}` : '';
        return this.http.get<Employee[]>(`${this.api}${query}`);
    }

    getById(id: number): Observable<Employee> {
        return this.http.get<Employee>(`${this.api}/${id}`);
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
}
