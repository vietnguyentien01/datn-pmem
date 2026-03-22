import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LeaveRequestComponent } from './features/leave/leave-request/leave-request.component';
import { LeaveApprovalComponent } from './features/leave/leave-approval/leave-approval.component';
import { EmployeeListComponent } from './features/employees/employee-list/employee-list.component';
import { LayoutComponent } from './shared/layout/layout.component';

// Interceptor & Guard
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { EmployeeDetailComponent } from './features/employees/employee-detail/employee-detail.component';
import { PayrollViewComponent } from './features/payroll/payroll-view/payroll-view.component';
import { AttendanceHistoryComponent } from './features/attendance/attendance-history/attendance-history.component';
import { AttendanceSummaryComponent } from './features/attendance/attendance-summary/attendance-summary.component';
import { CheckinComponent } from './features/attendance/checkin/checkin.component';
import { WorkScheduleComponent } from './features/admin/work-schedule/work-schedule.component';
import { HeaderComponent } from './shared/header/header.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { PayrollAdminComponent } from './features/payroll/payroll-admin/payroll-admin.component';
import { SalaryChangeDialogComponent } from './features/employees/salary-change-dialog/salary-change-dialog.component';
import { SalaryApprovalComponent } from './features/payroll/salary-approval/salary-approval.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    LeaveRequestComponent,
    LeaveApprovalComponent,
    EmployeeListComponent,
    LayoutComponent,
    EmployeeDetailComponent,
    PayrollViewComponent,
    AttendanceHistoryComponent,
    AttendanceSummaryComponent,
    CheckinComponent,
    WorkScheduleComponent,
    HeaderComponent,
    SidebarComponent,
    PayrollAdminComponent,
    SalaryChangeDialogComponent,
    SalaryApprovalComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatBadgeModule,
    MatDividerModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
