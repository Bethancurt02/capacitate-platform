import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Cursos
  getCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/courses`);
  }

  getCourseById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/courses/${id}`);
  }

  // Lecciones
  getLessonsByCourse(courseId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/lessons/course/${courseId}`);
  }

  getQuestionsByLesson(lessonId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/lessons/${lessonId}/questions`);
  }

  // Progreso
  getAllProgress(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/progress`);
  }

  getProgress(courseId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/progress/${courseId}`);
  }

  markLessonCompleted(courseId: string, lessonId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/progress/${courseId}/lesson/${lessonId}`, {});
  }

  passLessonQuiz(courseId: string, lessonId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/progress/${courseId}/lesson/${lessonId}/quiz`, {});
  }

  getFinalExamQuestions(courseId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/courses/${courseId}/exam`);
  }

  passFinalExam(courseId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/progress/${courseId}/exam`, {});
  }

  resetProgress(courseId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/progress/${courseId}`);
  }

  // Certificado
  getCertificateUrl(courseId: string): string {
    // Usaremos un truco: al ser un GET que devuelve un PDF, el usuario puede simplemente abrir esta URL con su token.
    // Sin embargo, en headers necesitamos Bearer token, así que lo ideal es hacer la petición HTTP y generar un blob.
    return `${this.apiUrl}/certificates/${courseId}`;
  }

  downloadCertificate(courseId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/certificates/${courseId}`, { responseType: 'blob' });
  }
}
