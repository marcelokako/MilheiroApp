import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { PessoaModalComponent } from '../components/pessoa-modal/pessoa-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalManagerService {
  constructor(private dialog: MatDialog) {}

  // Método para abrir o modal de cadastro de pessoa
  openPessoaModal(data?: { nome?: string; email?: string }): Observable<any> {
    const dialogRef = this.dialog.open(PessoaModalComponent, {
      width: '400px',
      data: data || {},
    });

    return dialogRef.afterClosed();
  }
}
