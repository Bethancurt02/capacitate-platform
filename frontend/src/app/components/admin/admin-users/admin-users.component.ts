import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { UiService } from '../../../services/ui.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss'
})
export class AdminUsersComponent implements OnInit {
  private adminService = inject(AdminService);
  private uiService = inject(UiService);

  users: any[] = [];
  filteredUsers: any[] = [];
  isLoading = true;
  searchTerm = '';
  selectedRole = '';

  // User Detail / Edit
  selectedUser: any = null;
  isEditModalOpen = false;
  isDetailModalOpen = false;

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.isLoading = true;
    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    this.filteredUsers = this.users.filter(user => {
      const matchSearch = (user.nombre || '').toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          (user.email || '').toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchRole = this.selectedRole ? user.rol === this.selectedRole : true;
      return matchSearch && matchRole;
    });
  }

  viewDetails(user: any) {
    this.isLoading = true;
    this.adminService.getUserDetails(user._id).subscribe({
      next: (data) => {
        this.selectedUser = data;
        this.isDetailModalOpen = true;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
        this.isLoading = false;
      }
    });
  }

  toggleRole(user: any) {
    const newRole = user.rol === 'admin' ? 'user' : 'admin';
    this.uiService.confirm({
      title: 'Cambiar Rol',
      message: `¿Estás seguro de cambiar el rol de ${user.nombre} a ${newRole === 'admin' ? 'Administrador' : 'Estudiante'}?`,
      type: 'info',
      onConfirm: () => {
        this.adminService.updateUser(user._id, { rol: newRole }).subscribe({
          next: () => {
            user.rol = newRole;
            this.applyFilters();
          }
        });
      }
    });
  }

  deleteUser(user: any) {
    this.uiService.confirm({
      title: 'Eliminar Usuario',
      message: `¿Estás seguro de eliminar a ${user.nombre}? Esta acción no se puede deshacer y el usuario perderá todo su progreso.`,
      type: 'danger',
      confirmText: 'Sí, Eliminar',
      onConfirm: () => {
        this.adminService.deleteUser(user._id).subscribe({
          next: () => {
            this.users = this.users.filter(u => u._id !== user._id);
            this.applyFilters();
          }
        });
      }
    });
  }

  closeModals() {
    this.isEditModalOpen = false;
    this.isDetailModalOpen = false;
    this.selectedUser = null;
  }

  getCompletedCount(): number {
    if (!this.selectedUser || !this.selectedUser.progress) return 0;
    return this.selectedUser.progress.filter((p: any) => p.finalExamenPasado).length;
  }

  downloadCertificate(courseId: string, courseTitle: string) {
    if (!this.selectedUser) return;
    this.adminService.downloadUserCertificate(this.selectedUser.user._id, courseId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Certificado-${this.selectedUser.user.nombre}-${courseTitle}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Error downloading certificate:', err)
    });
  }
}
