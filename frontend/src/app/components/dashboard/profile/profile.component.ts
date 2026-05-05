import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService } from '../../../services/auth.service';
import { CourseService } from '../../../services/course.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private courseService = inject(CourseService);
  private sanitizer = inject(DomSanitizer);

  user$ = this.authService.currentUser$;
  baseUrl = this.authService.baseUrl;
  user: any;

  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  selectedFile: File | null = null;
  imagePreview: SafeUrl | string | null = null;

  progresses: any[] = [];

  isSavingProfile = false;
  isSavingPassword = false;
  
  profileMessage = { type: '', text: '' };
  passwordMessage = { type: '', text: '' };

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => {
      if (u) {
        this.user = u;
        if (!this.profileForm) {
          this.initForms();
        } else {
          this.profileForm.patchValue({
            nombre: u.nombre,
            email: u.email
          });
        }
      }
    });

    this.courseService.getAllProgress().subscribe(p => {
      this.progresses = p;
    });
  }

  initForms() {
    this.profileForm = this.fb.group({
      nombre: [this.user.nombre, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmitProfile() {
    // Forzar la validación para mostrar errores si el usuario tocó Guardar sin llenar
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.profileMessage = { type: 'error', text: 'Por favor, llena los campos requeridos.' };
      return;
    }

    this.isSavingProfile = true;
    this.profileMessage = { type: '', text: '' };

    const formData = new FormData();
    formData.append('nombre', this.profileForm.value.nombre);
    formData.append('email', this.profileForm.value.email);
    if (this.selectedFile) {
      formData.append('fotoPerfil', this.selectedFile);
    }

    this.authService.updateProfile(formData).subscribe({
      next: (res) => {
        this.isSavingProfile = false;
        this.profileMessage = { type: 'success', text: 'Perfil actualizado correctamente' };
        this.imagePreview = null;
        this.selectedFile = null;
        // Asignar el nuevo usuario explícitamente para que angular detecte el cambio de fotoPerfil
        this.user = { ...this.user, ...res };
      },
      error: (err) => {
        this.isSavingProfile = false;
        this.profileMessage = { type: 'error', text: err.error?.message || 'Error al actualizar perfil' };
      }
    });
  }

  onSubmitPassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this.passwordMessage = { type: 'error', text: 'La nueva contraseña debe tener mínimo 6 caracteres.' };
      return;
    }

    this.isSavingPassword = true;
    this.passwordMessage = { type: '', text: '' };

    this.authService.updatePassword(this.passwordForm.value).subscribe({
      next: (res) => {
        this.isSavingPassword = false;
        this.passwordMessage = { type: 'success', text: 'Contraseña actualizada' };
        this.passwordForm.reset();
      },
      error: (err) => {
        this.isSavingPassword = false;
        this.passwordMessage = { type: 'error', text: err.error?.message || 'Error al actualizar contraseña' };
      }
    });
  }
}
