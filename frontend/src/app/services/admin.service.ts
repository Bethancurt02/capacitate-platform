import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin`;
  private coursesUrl = `${environment.apiUrl}/courses`;

  // Estadísticas
  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  // Gestión de Usuarios
  getUsers(filters: any = {}): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`, { params: filters });
  }

  getUserDetails(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`);
  }

  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}`, userData);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  // Gestión de Cursos
  getAdminCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.coursesUrl}/admin`);
  }

  getCourseStudents(courseId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.coursesUrl}/${courseId}/students`);
  }

  createCourse(courseData: any): Observable<any> {
    return this.http.post(this.coursesUrl, courseData);
  }

  updateCourse(id: string, courseData: any): Observable<any> {
    return this.http.put(`${this.coursesUrl}/${id}`, courseData);
  }

  deleteCourse(id: string): Observable<any> {
    return this.http.delete(`${this.coursesUrl}/${id}`);
  }

  downloadUserCertificate(userId: string, courseId: string): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/certificates/admin/${userId}/${courseId}`, { responseType: 'blob' });
  }
}
