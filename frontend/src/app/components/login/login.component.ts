import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  isLoading = false;
  errorMessage = '';

  // Rate limiting
  failedAttempts = 0;
  isLockedOut = false;
  lockoutSeconds = 0;
  countdownDisplay = 0;
  private countdownInterval: any;

  get f() {
    return this.loginForm.controls;
  }

  ngOnDestroy() {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.isLockedOut) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.failedAttempts = 0;
        if (res.rol === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          const returnUrl = (this.route.snapshot.queryParams as any)['returnUrl'] || '/dashboard';
          this.router.navigateByUrl(returnUrl);
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.failedAttempts++;
        this.errorMessage = err.error?.message || 'Correo o contraseña incorrectos';

        if (this.failedAttempts >= 3) {
          this.startLockout();
        }
      }
    });
  }

  startLockout() {
    // Cada bloqueo suma 30 segundos más: 30, 60, 90...
    // failedAttempts es siempre múltiplo de 3 al entrar aquí
    const lockoutMultiplier = Math.floor(this.failedAttempts / 3);
    this.lockoutSeconds = lockoutMultiplier * 30;
    this.countdownDisplay = this.lockoutSeconds;
    this.isLockedOut = true;
    this.loginForm.disable();

    if (this.countdownInterval) clearInterval(this.countdownInterval);

    this.countdownInterval = setInterval(() => {
      this.countdownDisplay--;
      if (this.countdownDisplay <= 0) {
        clearInterval(this.countdownInterval);
        this.isLockedOut = false;
        this.loginForm.enable();
        this.errorMessage = '';
      }
    }, 1000);
  }

  dismissLockout() {
    // Solo para cerrar el overlay visual; el countdown sigue corriendo
  }
}
