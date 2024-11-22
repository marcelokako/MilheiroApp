import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { PessoaModalComponent } from '../components/pessoa-modal/pessoa-modal.component';
import { PlataformaModalComponent } from '../components/plataforma-modal/plataforma-modal.component';
import { AddPontosModalComponent } from '../components/add-pontos-modal/add-pontos-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalManagerService {
  constructor(private dialog: MatDialog) {}

  openPessoaModal(data?: { nome?: string; email?: string }): Observable<any> {
    const dialogRef = this.dialog.open(PessoaModalComponent, {
      width: '40%',
      data: data || {},
    });

    return dialogRef.afterClosed();
  }
  
  openPlataformaModal(): Observable<any> {
    const dialogRef = this.dialog.open(PlataformaModalComponent, {
      width: '40%',
    });
    
    return dialogRef.afterClosed();
  }

  openAddPontosModal(
    data?: { 
      pessoa_id: number,
      plataforma_id?: number,
      plataforma_nome?: string,
      data? :string,
      pontos: number,
      valor: number,
      data_expiracao?: string,
      descricao?: string
    }): Observable<any> {
    const dialogRef = this.dialog.open(AddPontosModalComponent, {
      width: '60%',
      data: data || {},
    });

    return dialogRef.afterClosed();
  }
}
