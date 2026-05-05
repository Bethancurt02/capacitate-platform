import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UiService, ModalConfig } from '../../services/ui.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  public uiService = inject(UiService);

  activeModal: ModalConfig | null = null;

  ngOnInit() {
    this.uiService.modal$.subscribe(modal => {
      this.activeModal = modal;
    });
  }

  handleConfirm() {
    if (this.activeModal) {
      this.activeModal.onConfirm();
      this.uiService.closeModal();
    }
  }

  handleCancel() {
    this.uiService.closeModal();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
