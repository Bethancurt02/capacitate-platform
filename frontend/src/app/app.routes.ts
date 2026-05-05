import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/dashboard/home/home.component';
import { CourseListComponent } from './components/dashboard/course-list/course-list.component';
import { CourseDetailComponent } from './components/dashboard/course-detail/course-detail.component';
import { ProfileComponent } from './components/dashboard/profile/profile.component';
import { ProgressComponent } from './components/dashboard/progress/progress.component';
import { AdminComponent } from './components/admin/admin.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { AdminCoursesComponent } from './components/admin/admin-courses/admin-courses.component';
import { AdminStatsComponent } from './components/admin/admin-stats/admin-stats.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    children: [
      { path: 'inicio', component: HomeComponent },
      { path: 'cursos', component: CourseListComponent },
      { path: 'curso/:id', component: CourseDetailComponent },
      { path: 'perfil', component: ProfileComponent, canActivate: [authGuard] },
      { path: 'progreso', component: ProgressComponent, canActivate: [authGuard] },
      { path: '', redirectTo: 'inicio', pathMatch: 'full' }
    ]
  },
  { 
    path: 'admin', 
    component: AdminComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'admin' },
    children: [
      { path: 'dashboard', component: AdminStatsComponent },
      { path: 'usuarios', component: AdminUsersComponent },
      { path: 'cursos', component: AdminCoursesComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
