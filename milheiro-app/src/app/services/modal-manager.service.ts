import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { PessoaModalComponent } from '../components/pessoa-modal/pessoa-modal.component';
import { PlataformaModalComponent } from '../components/plataforma-modal/plataforma-modal.component';
import { AddPontosModalComponent } from '../components/add-pontos-modal/add-pontos-modal.component';
import { Plataforma } from './database.service';
import { CalculadoraModalComponent } from '../components/calculadora-modal/calculadora-modal.component';
import { UsarPontosModalComponent } from '../components/usar-pontos-modal/usar-pontos-modal.component';

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
      pontos: number,
      valor: number,
      custo_ponto?: number,
      descricao?: string,
      data_aquisicao? :string,
      data_expiracao?: string,
      created_at?: string,
      created_by?: number,
      recorrencia_tipo: string,
      recorrencia_id: number
    }): Observable<any> {
    const dialogRef = this.dialog.open(AddPontosModalComponent, {
      width: '60%',
      data: data || {},
    });

    return dialogRef.afterClosed();
  }

  openCalculadoraModal(data?: Plataforma): Observable<any> {
    const dialogRef = this.dialog.open(CalculadoraModalComponent, {
      width: '60%',
      data: data || {},
    });

    return dialogRef.afterClosed();
  }

  openUsarPontosModal(
    data?: { 
      selectPessoa_option?: any,
      plataformaSelecionada?: Plataforma,
      pontos?: number,
      custo_ponto?: any,
      custo_equivalente?: any,
      data_aquisicao?: string,
      descricao?: string,
    }): Observable<any> {
    const dialogRef = this.dialog.open(UsarPontosModalComponent, {
      width: '60%',
      data: data || {},
    });

    return dialogRef.afterClosed();
  }
}
