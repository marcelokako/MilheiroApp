import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { PessoaModalComponent } from '../components/pessoa-modal/pessoa-modal.component';
import { PlataformaModalComponent } from '../components/plataforma-modal/plataforma-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalManagerService {
  constructor(private dialog: MatDialog) {}

  openPessoaModal(data?: { nome?: string; email?: string }): Observable<any> {
    const dialogRef = this.dialog.open(PessoaModalComponent, {
      width: '400px',
      data: data || {},
    });

    return dialogRef.afterClosed();
  }

  openPlataformaModal(): Observable<any> {
    const dialogRef = this.dialog.open(PlataformaModalComponent, {
      width: '400px',
    });

    return dialogRef.afterClosed();
  }
}
