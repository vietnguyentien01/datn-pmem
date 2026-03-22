import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginResponse {
    token: string;
    username: string;
    role: string;
    employeeId: number;
    fullName: string;
    email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private currentUserSubject = new BehaviorSubject<LoginResponse | null>(this.getStoredUser());
    currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) { }

    login(username: string, password: string): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { username, password })
            .pipe(tap(response => {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response));
                this.currentUserSubject.next(response);
            }));
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

    getCurrentUser(): LoginResponse | null {
        return this.currentUserSubject.value;
    }

    hasRole(role: string): boolean {
        return this.getCurrentUser()?.role === role;
    }

    isManager(): boolean {
        const role = this.getCurrentUser()?.role;
        return role === 'ADMIN' || role === 'MANAGER';
    }

    isHR(): boolean {
        const role = this.getCurrentUser()?.role;
        return role === 'ADMIN' || role === 'HR';
    }

    private getStoredUser(): LoginResponse | null {
        const u = localStorage.getItem('user');
        return u ? JSON.parse(u) : null;
    }
}
