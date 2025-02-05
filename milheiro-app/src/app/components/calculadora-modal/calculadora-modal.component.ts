import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatabaseService, Pessoa, Plataforma } from '../../services/database.service';
import { ModalManagerService } from '../../services/modal-manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private modalManager: ModalManagerService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Plataforma
  ) {        
    this.plataformaSelecionada = data;
    this.pontos_disponiveis = data.pontos??0;
    this.valor_ponto = data.custo_ponto??"0,00";
    this.loadPlataformas(data.pessoa_id??this.pessoaSelecionada_id);
  }

  trackById(index: number, item: any): number {
    return item.id; // Garante que o Angular rastreie corretamente os objetos
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
      (this.preco_pontos/1000) * this.valor_ponto + this.taxa_embarque_pontos;

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

  AddPonto(){
    let data_hoje = new Date(Date.now()).toISOString().slice(0,10);
    let obj_pontos = {
      "pessoa_id": this.selectPessoa_option,
      "plataforma_id": this.plataformaSelecionada?.id,
      "plataforma_nome": this.plataformaSelecionada?.plataforma,
      "data_aquisicao": data_hoje,
      "pontos": this.pontos_acumulados,
      "valor": 0,
      "data_expiracao": "",
      "recorrencia_tipo": 'N',
      "recorrencia_id": 0,
      "descricao": "Bônus acumulado em compra" + 
        (!!this.plataformaSelecionada ? " em " + this.plataformaSelecionada?.plataforma : "")
        + (" em " + data_hoje),
    };
    this.modalManager.openAddPontosModal(obj_pontos).subscribe((obj_pontos_add)=>{
      if(obj_pontos_add){
        this.databaseService.AddPonto(obj_pontos_add).subscribe({
          next: (obj_ponto) => {
            this.snackBar.open(`${obj_ponto.pontos} pontos adicionados com sucesso!`, 'Fechar', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['success-snackbar'],
            });
          },
          error: (e)=>{
            console.error("Erro ao adicionar ponto: ", e)
          }
        });
      }
    })
  }

  UsarPonto(){
    let data_hoje = new Date(Date.now()).toISOString().slice(0,10);
    let obj_pontos = {
      "pessoa_id": this.selectPessoa_option,
      "plataforma": this.plataformaSelecionada,
      "plataformas": this.plataformas,
      "plataforma_id": this.plataformaSelecionada?.id,
      "plataforma_nome": this.plataformaSelecionada?.plataforma,
      "data_aquisicao": data_hoje,
      "pontos": this.preco_pontos,
      "valor": 0,
      "data_expiracao": "",
      "recorrencia_tipo": 'N',
      "recorrencia_id": 0,
      "descricao": "Pontos usados" + 
        (!!this.plataformaSelecionada ? " em plataforma " + this.plataformaSelecionada?.plataforma : "")
        + (" em " + data_hoje),
    };
    this.modalManager.openUsarPontosModal(obj_pontos).subscribe((obj_pontos_add)=>{
      if(obj_pontos_add){
        this.databaseService.AddPonto(obj_pontos_add).subscribe({
          next: (obj_ponto) => {
            this.snackBar.open(`${obj_ponto.pontos} pontos adicionados com sucesso!`, 'Fechar', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['success-snackbar'],
            });
          },
          error: (e)=>{
            console.error("Erro ao adicionar ponto: ", e)
          }
        });
      }
    })
  }
}
