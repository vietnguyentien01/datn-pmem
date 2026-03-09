import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats = {
    totalEmployees: 0,
    presentToday: 0,
    onLeaveToday: 0
  };

  constructor() { }

  ngOnInit(): void {
    // Gọi API thống kê
  }
}
