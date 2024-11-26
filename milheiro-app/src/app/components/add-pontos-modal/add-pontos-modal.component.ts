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
  selectPessoa_option: number = 0;
  pessoas: Pessoa[] = [];
  plataformas: Plataforma[] = [];
  plataforma_id: number = 0;
  plataforma_nome: string = '';
  data: string = '';
  pontos: number = 0;
  valor: number = 0;
  custo_ponto: string = '0,00';
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
      this.data = obj.data || new Date(Date.now()).toISOString().slice(0,10);
      this.pontos = obj.pontos || 0;
      this.valor = obj.valor || 0;
      this.data_expiracao = obj.data_expiracao || '';
      this.descricao = obj.descricao || '';
    }
  }
  
  ngOnInit(): void {
    this.loadPessoas();
    this.databaseService.pessoaSelecionada$.subscribe(pessoa => {
      this.pessoaSelecionada_id = pessoa ? pessoa.id??0 : 0;
      this.selectPessoa_option = this.pessoaSelecionada_id
      this.loadPlataformas(this.pessoaSelecionada_id);
    });
    this.calcular_custo_ponto()
  }

  loadPlataformas(pessoa_id: number) {  
   
    if (pessoa_id == 0) {
      this.plataformas = [];
      return;
    }
    this.databaseService.getPlataformasPessoa(Number(pessoa_id)).subscribe((plataformas) => {
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
    const dadosSalvar = {
      pessoa_id: this.pessoaSelecionada_id,
      plataforma_id: this.plataforma_id,
      pontos: this.pontos,
      valor_total: this.valor,
      custo_ponto: parseFloat(this.custo_ponto),
      descricao: this.descricao,
      data_expiracao: this.data_expiracao,
      data_criacao: new Date().toISOString(),
    };
  
    this.dialogRef.close(dadosSalvar);
  }

  calcular_custo_ponto(){
    if(this.pontos == 0 || this.valor == 0){
      this.custo_ponto = '0,00';
    } else {
      this.custo_ponto = (Number(this.pontos) / Number(this.valor)).toFixed(2);
    }
  }
}
