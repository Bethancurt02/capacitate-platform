import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  forgotForm: FormGroup;
  resetForm: FormGroup;
  
  step: 'email' | 'code' | 'success' = 'email';
  isLoading = false;
  errorMessage = '';
  emailForReset = '';
  emailPreviewUrl = ''; // Ethereal preview URL for testing

  constructor() {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmitEmail() {
    if (this.forgotForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    const email = this.forgotForm.value.email;

    this.authService.forgotPassword(email).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.emailForReset = email;
        this.emailPreviewUrl = res.previewUrl || '';
        this.step = 'code';
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Error al enviar el código';
      }
    });
  }

  onSubmitReset() {
    if (this.resetForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    const { code, password } = this.resetForm.value;

    this.authService.resetPassword(this.emailForReset, code, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.step = 'success';
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Código incorrecto o expirado';
      }
    });
  }
}
