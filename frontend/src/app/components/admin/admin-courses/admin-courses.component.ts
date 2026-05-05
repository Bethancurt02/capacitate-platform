import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { UiService } from '../../../services/ui.service';

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-courses.component.html',
  styleUrl: './admin-courses.component.scss'
})
export class AdminCoursesComponent implements OnInit {
  private adminService = inject(AdminService);
  private uiService = inject(UiService);

  courses: any[] = [];
  isLoading = true;
  
  // Create/Edit Course
  isModalOpen = false;
  isEditing = false;
  currentCourse: any = {
    titulo: '',
    descripcion: '',
    categoria: '',
    imagen: '',
    videoIntro: '',
    isActive: true,
    lessons: []
  };

  ngOnInit() {
    this.fetchCourses();
  }

  fetchCourses() {
    this.isLoading = true;
    this.adminService.getAdminCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching admin courses:', err);
        this.isLoading = false;
      }
    });
  }

  openCreateModal() {
    this.isEditing = false;
    this.currentCourse = { 
      titulo: '', 
      descripcion: '', 
      categoria: '', 
      imagen: '', 
      videoIntro: '',
      isActive: true,
      lessons: [] 
    };
    this.isModalOpen = true;
  }

  openEditModal(course: any) {
    this.isEditing = true;
    this.currentCourse = { ...course, lessons: course.lessons || [] };
    this.isModalOpen = true;
  }

  addLesson() {
    this.currentCourse.lessons.push({
      titulo: '',
      contenido: '',
      questions: []
    });
  }

  removeLesson(index: number) {
    this.currentCourse.lessons.splice(index, 1);
  }

  addQuestion(lessonIndex: number) {
    this.currentCourse.lessons[lessonIndex].questions.push({
      pregunta: '',
      opciones: ['', '', '', ''],
      respuestaCorrecta: 0
    });
  }

  removeQuestion(lessonIndex: number, qIndex: number) {
    this.currentCourse.lessons[lessonIndex].questions.splice(qIndex, 1);
  }

  saveCourse() {
    if (this.isEditing) {
      this.adminService.updateCourse(this.currentCourse._id, this.currentCourse).subscribe({
        next: () => {
          this.fetchCourses();
          this.isModalOpen = false;
        }
      });
    } else {
      this.adminService.createCourse(this.currentCourse).subscribe({
        next: () => {
          this.fetchCourses();
          this.isModalOpen = false;
        }
      });
    }
  }

  toggleStatus(course: any) {
    const newStatus = !course.isActive;
    this.adminService.updateCourse(course._id, { isActive: newStatus }).subscribe({
      next: () => course.isActive = newStatus
    });
  }

  deleteCourse(course: any) {
    this.uiService.confirm({
      title: 'Eliminar Curso',
      message: `¿Estás completamente seguro de eliminar "${course.titulo}"? Esta acción es irreversible y se perderá todo el progreso y certificados de los estudiantes inscritos.`,
      type: 'danger',
      confirmText: 'Sí, Eliminar Curso',
      onConfirm: () => {
        this.adminService.deleteCourse(course._id).subscribe({
          next: () => this.fetchCourses(),
          error: (err) => console.error('Error deleting course:', err)
        });
      }
    });
  }

  downloadUserCertificate(userId: string, courseId: string) {
    this.adminService.downloadUserCertificate(userId, courseId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Certificado.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  trackByFn(index: number, item: any) {
    return index;
  }
}
