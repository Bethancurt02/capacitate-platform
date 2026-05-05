import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../../services/course.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss'
})
export class CourseListComponent implements OnInit {
  private courseService = inject(CourseService);
  private authService = inject(AuthService);
  
  courses: any[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching courses', err);
        this.isLoading = false;
      }
    });
  }

  getCourseImage(path: string): string {
    if (!path) return 'assets/default-course.png';
    if (path.startsWith('http')) return path;
    return `${this.authService.baseUrl}${path}`;
  }
}
