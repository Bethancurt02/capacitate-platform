import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ModalConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info' | 'success';
  onConfirm: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private modalSubject = new Subject<ModalConfig | null>();
  public modal$ = this.modalSubject.asObservable();

  confirm(config: ModalConfig) {
    this.modalSubject.next(config);
  }

  closeModal() {
    this.modalSubject.next(null);
  }
}
