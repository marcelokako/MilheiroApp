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
  data_aquisicao: string = '';
  pontos: number = 0;
  valor: number = 0;
  custo_ponto: string = '0,00';
  data_expiracao: string = '';
  descricao: string = '';
  recorrencia_tipo: string = 'N';

  constructor(
    private databaseService: DatabaseService, 
    public dialogRef: MatDialogRef<AddPontosModalComponent>,
    @Inject(MAT_DIALOG_DATA) public obj: any
  ) {
    if (obj) {
      this.plataforma_id = obj.plataforma_id || '';
      this.plataforma_nome = obj.plataforma_nome || '';
      this.data_aquisicao = obj.data_aquisicao || new Date(Date.now()).toISOString().slice(0,10);
      this.pontos = obj.pontos || 0;
      this.valor = obj.valor || 0;
      this.data_expiracao = obj.data_expiracao || '';
      this.descricao = obj.descricao || '';
      this.recorrencia_tipo = obj.recorrencia_tipo || "N";

    }
  }
  
  ngOnInit(): void {
    this.loadPessoas();
    this.databaseService.pessoaSelecionada$.subscribe(pessoa => {
      this.pessoaSelecionada_id = pessoa ? pessoa.id??0 : 0;
      this.selectPessoa_option = this.pessoaSelecionada_id
      this.loadPlataformas(this.pessoaSelecionada_id);
    });
    this.calcular_custo_ponto();
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
    if (this.selectPessoa_option <= 0 || !this.plataforma_id || this.pontos <= 0 || !this.data_aquisicao) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }
    if(this.recorrencia_tipo != 'N'){
      if(!this.descricao){
        alert('Descrição é obrigatório quando há recorrência.');
      }
    }
    const dadosSalvar = {
      pessoa_id: this.selectPessoa_option,
      plataforma_id: Number(this.plataforma_id),
      pontos: this.pontos,
      valor: this.valor,
      custo_ponto: parseFloat(this.custo_ponto),
      descricao: this.descricao,
      data_aquisicao: this.data_aquisicao,
      data_expiracao: this.data_expiracao,
      created_at: new Date(Date.now()).toLocaleString().replace(',',''),
      created_by: this.pessoaSelecionada_id,
      recorrencia_tipo: this.recorrencia_tipo,
      recorrencia_id: 0,
    };

    this.dialogRef.close(dadosSalvar);
  }

  calcular_custo_ponto(){
    if(this.pontos == 0 || this.valor == 0){
      this.custo_ponto = '0,00';
    } else {
      let custo_bruto = Number(this.valor) / Number(this.pontos);
      this.custo_ponto = (custo_bruto*1000).toFixed(2);
    }
  }

  selecionarTexto(input: HTMLInputElement): void {
    input.select();
  }
}
