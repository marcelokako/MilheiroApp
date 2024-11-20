import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-plataforma-modal',
  templateUrl: './plataforma-modal.component.html',
  styleUrl: './plataforma-modal.component.css'
})
export class PlataformaModalComponent {
  pessoaSelecionada_id: number = 0;
  plataforma_nome: string = '';

  constructor(
    private databaseService: DatabaseService, 
    public dialogRef: MatDialogRef<PlataformaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.plataforma_nome = data.plataforma_nome || '';
    }
  }
  
  ngOnInit(): void {
    this.databaseService.pessoaSelecionada$.subscribe(pessoa => {
      this.pessoaSelecionada_id = pessoa ? pessoa.id??0 : 0;
    });
  }

  cancelar(): void {
    this.dialogRef.close(null);
  }

  salvar(): void {
    if (!this.plataforma_nome || this.pessoaSelecionada_id == 0) {
      alert('Preencha todos os campos.');
      return;
    }
    this.dialogRef.close({ 
      pessoa_id: this.pessoaSelecionada_id,
      created_by: this.pessoaSelecionada_id, 
      plataforma: this.plataforma_nome,
      pontos: 0,
      valor_total: 0,
      custo_ponto: 0,
      created_at: new Date(Date.now()).toLocaleString().replace(',',''),
      updated_at: new Date(Date.now()).toLocaleString().replace(',','')
    });
  }
}
