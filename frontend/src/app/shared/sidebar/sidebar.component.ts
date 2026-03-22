import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isManager: boolean = false;
  isAdmin: boolean = false;
  isManagerOnly: boolean = false;
  isHR: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      if (user.role === 'ADMIN' || user.role === 'MANAGER') {
        this.isManager = true;
      }
      if (user.role === 'ADMIN') {
        this.isAdmin = true;
      }
      if (user.role === 'MANAGER') {
        this.isManagerOnly = true;
      }
      if (user.role === 'HR') {
        this.isHR = true;
      }
    }
  }
}
