import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatabaseService, Pessoa, Plataforma } from '../../services/database.service';

@Component({
  selector: 'app-calculadora-modal',
  templateUrl: './calculadora-modal.component.html',
  styleUrls: ['./calculadora-modal.component.css'],
})
export class CalculadoraModalComponent {
  pessoas: Pessoa[] = [];
  plataformas: Plataforma[] = [];
  plataformaSelecionada?: Plataforma;
  pontos_disponiveis: number = 0;
  pessoaSelecionada_id: number = 0;
  selectPessoa_option: number = 0;

  // Variáveis de Pontos
  preco_pontos: number = 0;
  valor_ponto: number = 0;
  taxa_embarque_pontos: number = 0;

  // Variáveis de Dinheiro
  preco_dinheiro: number = 0;
  taxa_embarque_dinheiro: number = 0;
  pontos_acumulados: number = 0;

  // Resultado
  resultadoPontosDinheiro: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<CalculadoraModalComponent>,
    private databaseService: DatabaseService, 
    @Inject(MAT_DIALOG_DATA) public data: Plataforma
  ) {        
    this.plataformaSelecionada = data;
    this.pontos_disponiveis = data.pontos??0;
    this.valor_ponto = data.custo_ponto??"0,00";
    this.loadPlataformas(data.pessoa_id);
  }

  ngOnInit(): void {
    this.loadPessoas();
    this.databaseService.pessoaSelecionada$.subscribe(pessoa => {
      this.pessoaSelecionada_id = pessoa ? pessoa.id??0 : 0;
      this.selectPessoa_option = this.pessoaSelecionada_id
      this.loadPlataformas(this.pessoaSelecionada_id);
    });
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

  selecionarTexto(input: HTMLInputElement): void {
    input.select();
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  calcularResultado(): void {
    // Cálculo do custo efetivo em pontos
    const custoPontos =
      this.preco_pontos * this.valor_ponto + this.taxa_embarque_pontos;

    // Cálculo do custo efetivo em dinheiro
    const valorPontosAcumulados =
      (this.pontos_acumulados || 0) * this.valor_ponto;
    const custoDinheiro =
      this.preco_dinheiro + this.taxa_embarque_dinheiro - (valorPontosAcumulados/1000);

    // Comparação e decisão
    if (custoPontos < custoDinheiro) {
      this.resultadoPontosDinheiro = `Usar pontos é mais vantajoso. Custo efetivo: R$ ${custoPontos.toFixed(
        2
      )}`;
    } else if (custoDinheiro < custoPontos) {
      this.resultadoPontosDinheiro = `Pagar em dinheiro é mais vantajoso. Custo efetivo: R$ ${custoDinheiro.toFixed(
        2
      )}`;
    } else {
      this.resultadoPontosDinheiro = `Ambas as opções têm o mesmo custo efetivo: R$ ${custoPontos.toFixed(
        2
      )}`;
    }
  }

  atualizaValoresInputs(): void{  
    this.valor_ponto = this.plataformaSelecionada?.custo_ponto??0;
    this.pontos_disponiveis = this.plataformaSelecionada?.pontos??0
  }
}
