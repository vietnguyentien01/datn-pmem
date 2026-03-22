import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService, AppNotification } from '../../core/services/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userName: string = 'User';
  userRole: string = 'Employee';
  userInitial: string = 'U';

  notifications: AppNotification[] = [];
  unreadCount: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.username;
      this.userRole = user.role;
      this.userInitial = this.userName.charAt(0).toUpperCase();
      this.loadNotifications();
    }
  }

  loadNotifications() {
    this.notificationService.getMyNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
        this.unreadCount = data.filter(n => !n.isRead).length;
      },
      error: (err) => console.error('Lỗi tải thông báo', err)
    });
  }

  markAsRead(n: AppNotification) {
    if (!n.isRead) {
      this.notificationService.markAsRead(n.id).subscribe({
        next: () => {
          n.isRead = true;
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        }
      });
    }
  }

  markAllAsRead() {
    if (this.unreadCount > 0) {
      this.notificationService.markAllAsRead().subscribe({
        next: () => {
          this.notifications.forEach(n => n.isRead = true);
          this.unreadCount = 0;
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
