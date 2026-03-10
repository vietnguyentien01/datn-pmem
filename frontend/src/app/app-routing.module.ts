import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LeaveRequestComponent } from './features/leave/leave-request/leave-request.component';
import { LeaveApprovalComponent } from './features/leave/leave-approval/leave-approval.component';
import { EmployeeListComponent } from './features/employees/employee-list/employee-list.component';
import { EmployeeDetailComponent } from './features/employees/employee-detail/employee-detail.component';
import { PayrollViewComponent } from './features/payroll/payroll-view/payroll-view.component';
import { AttendanceHistoryComponent } from './features/attendance/attendance-history/attendance-history.component';
import { CheckinComponent } from './features/attendance/checkin/checkin.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'leave/request', component: LeaveRequestComponent },
      { path: 'leave/approval', component: LeaveApprovalComponent, data: { roles: ['ADMIN', 'MANAGER'] } },
      { path: 'employees', component: EmployeeListComponent, data: { roles: ['ADMIN'] } },
      { path: 'employees/:id', component: EmployeeDetailComponent, data: { roles: ['ADMIN'] } },
      { path: 'payroll', component: PayrollViewComponent },
      { path: 'attendance/history', component: AttendanceHistoryComponent },
      { path: 'attendance/checkin', component: CheckinComponent },
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
