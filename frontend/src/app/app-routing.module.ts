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
import { PayrollAdminComponent } from './features/payroll/payroll-admin/payroll-admin.component';
import { AttendanceHistoryComponent } from './features/attendance/attendance-history/attendance-history.component';
import { AttendanceSummaryComponent } from './features/attendance/attendance-summary/attendance-summary.component';
import { CheckinComponent } from './features/attendance/checkin/checkin.component';
import { WorkScheduleComponent } from './features/admin/work-schedule/work-schedule.component';
import { SalaryApprovalComponent } from './features/payroll/salary-approval/salary-approval.component';
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
      { path: 'leave/approval', component: LeaveApprovalComponent, data: { roles: ['ADMIN', 'MANAGER', 'HR'] } },
      { path: 'employees', component: EmployeeListComponent, data: { roles: ['ADMIN'] } },
      { path: 'employees/me', component: EmployeeDetailComponent },
      { path: 'employees/:id', component: EmployeeDetailComponent, data: { roles: ['ADMIN'] } },
      { path: 'payroll/admin', component: PayrollAdminComponent, data: { roles: ['HR'] } },
      { path: 'payroll/me', component: PayrollViewComponent },
      { path: 'attendance/history', component: AttendanceHistoryComponent },
      { path: 'attendance/summary', component: AttendanceSummaryComponent, data: { roles: ['HR'] } },
      { path: 'attendance/checkin', component: CheckinComponent },
      { path: 'salary/approval', component: SalaryApprovalComponent, data: { roles: ['ADMIN'] } },
      { path: 'admin/work-schedule', component: WorkScheduleComponent, data: { roles: ['ADMIN'] } },
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
