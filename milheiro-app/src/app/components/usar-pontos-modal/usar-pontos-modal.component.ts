import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatabaseService, Pessoa, Plataforma } from '../../services/database.service';

@Component({
  selector: 'app-usar-pontos-modal',
  templateUrl: './usar-pontos-modal.component.html',
  styleUrl: './usar-pontos-modal.component.css'
})
export class UsarPontosModalComponent {
  pessoaSelecionada_id: number = 0;
  selectPessoa_option: number = 0;
  pessoas: Pessoa[] = [];
  plataformas: Plataforma[] = [];
  plataformaSelecionada?: Plataforma;
  data_aquisicao: string = ''; // data de uso
  pontos: number = 0;
  pontos_disponiveis: number = 0;
  custo_ponto: number = 0;
  custo_equivalente: string = "0,00";
  descricao: string = '';

  constructor(
    private databaseService: DatabaseService, 
    public dialogRef: MatDialogRef<UsarPontosModalComponent>,
    @Inject(MAT_DIALOG_DATA) public obj: any
  ) {
    if (obj) {
      this.plataformaSelecionada = obj.plataforma
      this.data_aquisicao = obj.data_aquisicao || new Date(Date.now()).toISOString().slice(0,10);
      this.pontos = obj.pontos || 0;
      this.pontos_disponiveis = obj.plataforma?.pontos||0 - this.pontos;
      this.descricao = obj.descricao || '';
      this.carregar_custo_ponto();
    }
  }
  
  ngOnInit(): void {
    this.loadPessoas();
    this.databaseService.pessoaSelecionada$.subscribe(pessoa => {
      this.pessoaSelecionada_id = pessoa ? pessoa.id??0 : 0;
      this.selectPessoa_option = this.pessoaSelecionada_id
      this.loadPlataformas(this.pessoaSelecionada_id);
    });
    this.carregar_custo_ponto();
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
    if (this.selectPessoa_option <= 0 || !this.plataformaSelecionada?.id || this.pontos <= 0 || !this.data_aquisicao) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }
    if (this.pontos > this.plataformaSelecionada.pontos) {
      alert('Não é possível utilizar mais pontos que o disponível em conta.');
      return;
    }
    const dadosSalvar = {
      pessoa_id: this.selectPessoa_option,
      plataforma_id: Number(this.plataformaSelecionada?.id),
      pontos: this.pontos * -1,
      valor: Number(this.custo_equivalente) * -1,
      custo_ponto: this.custo_ponto,
      descricao: this.descricao,
      data_aquisicao: this.data_aquisicao, // data uso
      created_at: new Date(Date.now()).toLocaleString().replace(',',''),
      created_by: this.pessoaSelecionada_id,
      recorrencia_id: 0,
    };

    this.dialogRef.close(dadosSalvar);
  }

  carregar_custo_ponto(){
    let max_pontos = this.plataformaSelecionada?.pontos;
    this.custo_ponto = this.plataformaSelecionada?.custo_ponto ?? 0;
    this.custo_equivalente = ((this.pontos/1000) * this.custo_ponto).toFixed(2);
    this.pontos_disponiveis = Number(max_pontos??0) - Number(this.pontos);   
  }

  selecionarTexto(input: HTMLInputElement): void {
    input.select();
  }
}
