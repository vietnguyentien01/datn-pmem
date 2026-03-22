import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AppNotification {
    id: number;
    userId: number;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private apiUrl = 'http://localhost:8080/api/notifications';

    constructor(private http: HttpClient) { }

    getMyNotifications(): Observable<AppNotification[]> {
        return this.http.get<AppNotification[]>(`${this.apiUrl}/my`);
    }

    markAsRead(id: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}/read`, {});
    }

    markAllAsRead(): Observable<any> {
        return this.http.put(`${this.apiUrl}/read-all`, {});
    }
}
