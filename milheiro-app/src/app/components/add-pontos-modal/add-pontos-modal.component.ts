import { Component, Inject } from '@angular/core';
import { DatabaseService, Pessoa, Plataforma } from '../../services/database.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-pontos-modal',
  templateUrl: './add-pontos-modal.component.html',
  styleUrl: './add-pontos-modal.component.css'
})
export class AddPontosModalComponent {

  pessoaSelecionada_id: number = 0;
  pessoas: Pessoa[] = [];
  plataformas: Plataforma[] = [];
  plataforma_id: string = '';
  plataforma_nome: string = '';
  data: string = '';
  pontos: number = 0
  valor: number = 0
  data_expiracao: string = '';
  descricao: string = '';

  constructor(
    private databaseService: DatabaseService, 
    public dialogRef: MatDialogRef<AddPontosModalComponent>,
    @Inject(MAT_DIALOG_DATA) public obj: any
  ) {
    if (obj) {
      this.plataforma_id = obj.plataforma_id || '';
      this.plataforma_nome = obj.plataforma_nome || '';
      this.data = obj.data || '';
      this.pontos = obj.pontos || 0;
      this.valor = obj.valor || 0;
      this.data_expiracao = obj.data_expiracao || '';
      this.descricao = obj.descricao || '';
    }
  }
  
  ngOnInit(): void {
    this.databaseService.pessoaSelecionada$.subscribe(pessoa => {
      this.pessoaSelecionada_id = pessoa ? pessoa.id??0 : 0;
      this.loadPessoas();
      this.loadPlataformas(this.pessoaSelecionada_id);
    });
  }

  loadPlataformas(pessoa_id: number) {
    this.databaseService.getPlataformasPessoa(pessoa_id).subscribe((plataformas) => {
      this.plataformas = plataformas;
    });
  }

  loadPessoas() {
    this.databaseService.getPessoas().subscribe((pessoas) => {
      this.pessoas = pessoas;
    });
  }

  cancelar(): void {
    this.dialogRef.close(null);
  }

  salvar(): void {
    // if (!this.plataforma_nome || this.pessoaSelecionada_id == 0) {
    //   alert('Preencha todos os campos.');
    //   return;
    // }
    // this.dialogRef.close({ 
    //   pessoa_id: this.pessoaSelecionada_id,
    //   created_by: this.pessoaSelecionada_id, 
    //   plataforma: this.plataforma_nome,
    //   pontos: this.pontos,
    //   valor_total: this.valor,
    //   custo_ponto: this.pontos / this.valor,
    //   created_at: new Date(Date.now()).toLocaleString().replace(',',''),
    //   updated_at: new Date(Date.now()).toLocaleString().replace(',','')
    // });
  }
}
