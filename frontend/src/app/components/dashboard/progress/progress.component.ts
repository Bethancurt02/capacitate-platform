import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../../services/course.service';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss'
})
export class ProgressComponent implements OnInit {
  private courseService = inject(CourseService);
  
  progresses: any[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.courseService.getAllProgress().subscribe({
      next: (data) => {
        this.progresses = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching progress', err);
        this.isLoading = false;
      }
    });
  }

  downloadCertificate(courseId: string, courseTitle: string) {
    this.courseService.downloadCertificate(courseId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Certificado-${courseTitle}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
