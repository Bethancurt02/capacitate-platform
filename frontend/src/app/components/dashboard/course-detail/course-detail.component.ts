import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../services/course.service';
import { AuthService } from '../../../services/auth.service';
import { SafePipe } from '../../../pipes/safe.pipe';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SafePipe],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss'
})
export class CourseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  public authService = inject(AuthService);

  Object = Object;

  courseId = '';
  course: any = null;
  lessons: any[] = [];
  progress: any = null;
  isLoggedIn = false;

  showIntro = true;
  activeLesson: any = null;
  activeQuestions: any[] = [];
  userAnswers: { [key: string]: number } = {};
  
  quizSubmitted = false;
  quizPassed = false;
  
  showFinalExam = false;
  finalExamPassed = false;

  isLoading = true;

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.courseId) {
      this.loadCourseData();
    }
  }

  loadCourseData() {
    this.isLoading = true;
    
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (c) => {
        this.course = c;
        
        this.courseService.getLessonsByCourse(this.courseId).subscribe({
          next: (l) => {
            this.lessons = l;
            
            if (this.isLoggedIn) {
              this.courseService.getProgress(this.courseId).subscribe({
                next: (p) => {
                  console.log('Progress Loaded:', p);
                  // Forzar inicialización si el objeto viene incompleto
                  this.progress = {
                    ...p,
                    leccionesCompletadas: p.leccionesCompletadas || [],
                    quicesCompletados: p.quicesCompletados || [],
                    porcentaje: p.porcentaje ?? 0
                  };
                  this.isLoading = false;
                  
                  if (this.progress && this.progress.leccionesCompletadas?.length > 0) {
                    this.showIntro = false;
                  }
                  
                  if (this.progress?.finalExamenPasado) {
                    this.finalExamPassed = true;
                  }
                },
                error: (err: any) => {
                  console.error('Error loading progress', err);
                  this.isLoading = false;
                }
              });
            } else {
              this.isLoading = false;
            }
          },
          error: (err: any) => {
            console.error('Error loading lessons', err);
            this.isLoading = false;
          }
        });
      },
      error: (err: any) => {
        console.error('Error loading course', err);
        this.isLoading = false;
      }
    });
  }

  viewIntro() {
    this.showIntro = true;
    this.activeLesson = null;
    this.showFinalExam = false;
  }

  isLessonCompleted(lessonId: string): boolean {
    if (!this.progress || !this.progress.quicesCompletados) return false;
    const searchId = lessonId?.toString();
    if (!searchId) return false;
    
    return this.progress.quicesCompletados.some((l: any) => {
      const compId = (typeof l === 'string') ? l : (l._id ? l._id.toString() : l?.toString());
      return compId === searchId;
    });
  }

  isLessonLocked(lesson: any): boolean {
    if (!lesson) return true;
    
    // Si es la lección activa, la desbloqueamos visualmente para que no salga el candado
    if (this.activeLesson && this.activeLesson._id === lesson._id) return false;

    // Si la lección ya está completada (quiz aprobado), nunca está bloqueada
    if (this.isLessonCompleted(lesson._id)) return false;
    
    // La primera lección nunca está bloqueada
    if (Number(lesson.orden) === 1) return false;
    
    // Buscar la lección anterior por orden
    const prevLesson = this.lessons.find(l => Number(l.orden) === Number(lesson.orden) - 1);
    if (!prevLesson) return false;
    
    // Bloqueada solo si la anterior no está completada
    return !this.isLessonCompleted(prevLesson._id);
  }

  canTakeFinalExam(): boolean {
    if (!this.progress || !this.lessons.length) return false;
    return this.progress.quicesCompletados.length === this.lessons.length && !this.progress.finalExamenPasado;
  }

  selectLesson(lesson: any, force: boolean = false) {
    if (!force && this.isLessonLocked(lesson)) {
      alert('Debes completar la lección anterior para acceder a esta.');
      return;
    }

    this.showIntro = false;
    this.activeLesson = lesson;
    this.showFinalExam = false;
    this.quizSubmitted = false;
    this.quizPassed = this.isLessonCompleted(lesson._id);
    this.userAnswers = {};
    this.activeQuestions = []; // Limpiar antes de cargar
    
    this.courseService.markLessonCompleted(this.courseId, lesson._id).subscribe({
      next: (p) => {
        this.progress = {
          ...p,
          leccionesCompletadas: p.leccionesCompletadas || [],
          quicesCompletados: p.quicesCompletados || [],
          porcentaje: p.porcentaje ?? 0
        };
        this.quizPassed = this.isLessonCompleted(lesson._id);
      },
      error: (err) => console.error('Error marking lesson as seen', err)
    });

    // Cargar preguntas de forma independiente para asegurar que aparezcan siempre
    this.courseService.getQuestionsByLesson(lesson._id).subscribe({
      next: (q) => {
        this.activeQuestions = q;
        console.log(`Questions loaded for lesson ${lesson.titulo}:`, q.length);
      },
      error: (err) => {
        console.error('Error loading questions', err);
        this.activeQuestions = [];
      }
    });
  }

  submitQuiz() {
    this.quizSubmitted = true;
    let correctCount = 0;
    
    this.activeQuestions.forEach((q) => {
      if (Number(this.userAnswers[q._id]) === Number(q.respuestaCorrecta)) {
        correctCount++;
      }
    });

    if (correctCount === this.activeQuestions.length && correctCount > 0) {
      this.quizPassed = true;
      this.courseService.passLessonQuiz(this.courseId, this.activeLesson._id).subscribe(p => {
        // Actualización inmediata para desbloquear
        this.progress = {
          ...p,
          leccionesCompletadas: p.leccionesCompletadas || [],
          quicesCompletados: p.quicesCompletados || [],
          porcentaje: p.porcentaje ?? 0
        };
        console.log('Quiz Passed! Progress updated:', this.progress);
      });
    } else {
      this.quizPassed = false;
    }
  }

  goToNextLesson() {
    const currentOrder = Number(this.activeLesson.orden);
    const nextLesson = this.lessons.find(l => Number(l.orden) === currentOrder + 1);
    
    console.log('Current Order:', currentOrder, 'Next Lesson found:', nextLesson?.titulo);
    
    if (nextLesson) {
      this.selectLesson(nextLesson, true);
    } else {
      console.log('No more lessons based on order, starting final exam');
      this.startFinalExam();
    }
  }

  startFinalExam() {
    this.showFinalExam = true;
    this.activeLesson = null;
    this.quizSubmitted = false;
    this.userAnswers = {};
    
    this.courseService.getFinalExamQuestions(this.courseId).subscribe(q => {
      this.activeQuestions = q;
    });
  }

  submitFinalExam() {
    this.quizSubmitted = true;
    let correctCount = 0;
    
    this.activeQuestions.forEach((q) => {
      if (Number(this.userAnswers[q._id]) === Number(q.respuestaCorrecta)) {
        correctCount++;
      }
    });

    if (correctCount === this.activeQuestions.length && correctCount > 0) {
      this.courseService.passFinalExam(this.courseId).subscribe(res => {
        if (res.progreso) this.progress = res.progreso;
        this.finalExamPassed = true;
        this.showFinalExam = false;
      });
    }
  }

  downloadCertificate() {
    this.courseService.downloadCertificate(this.courseId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Certificado-${this.course.titulo}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  resetCourse() {
    if (confirm('¿Estás seguro de que quieres reiniciar el curso? Se perderá todo tu progreso.')) {
      this.courseService.resetProgress(this.courseId).subscribe(() => {
        // Recargar todo el estado
        this.progress = {
          leccionesCompletadas: [],
          quicesCompletados: [],
          porcentaje: 0
        };
        this.finalExamPassed = false;
        this.showFinalExam = false;
        this.viewIntro();
        window.location.reload(); // Recarga simple para limpiar todo el estado
      });
    }
  }

  getCourseImage(path: string): string {
    if (!path) return 'assets/default-course.png';
    if (path.startsWith('http')) return path;
    return `${this.authService.baseUrl}${path}`;
  }
}
