// pessoas.component.ts
import { Component, OnInit } from '@angular/core';
import { DatabaseService, Pessoa } from '../../services/database.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalConfirmacaoComponent } from '../modal-confirmacao/modal-confirmacao.component';


@Component({
  selector: 'app-pessoas',
  templateUrl: './pessoas.component.html',
  styleUrls: ['./pessoas.component.css']
})
export class PessoasComponent implements OnInit {
  pessoas: Pessoa[] = [];
  nome: string = '';
  email: string = '';
  selected: boolean = false;
  showForm: boolean = false;
  holdTimeout: any;


  constructor(private databaseService: DatabaseService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadPessoas();
  }

  loadPessoas() {
    this.databaseService.getPessoas().subscribe((pessoas) => {
      this.pessoas = pessoas;
    });
  }

  addPessoa() {
    const newPessoa: Pessoa = { nome: this.nome, email: this.email, selected: false };
    if(!newPessoa.nome || !newPessoa.email){
      alert("Informações de cadastro inválidas");
    } else {

      this.databaseService.addPessoa(newPessoa).subscribe({
        next: (idAdd) => {
          this.nome = '';
          this.email = '';
          this.selected = false;
          
          this.showForm = false;
          this.selectPessoa(idAdd);
        },
        error: (e)=>{
          console.error("Erro ao add pessoa: ", e)
        }
      });
    }
  }

  selectPessoa(id: number | undefined){
    if (id === undefined) {
      console.warn("Erro");
      return;
    }    
    this.databaseService.selectPessoa(id).subscribe(()=>{
      this.loadPessoas();
    });
  }

  onHoldStart(pessoa: Pessoa) {
    this.holdTimeout = setTimeout(() => {
      this.abrirConfirmacaoDeletar(pessoa); 
    }, 1000);
  }
  
  onHoldEnd() {
    clearTimeout(this.holdTimeout);
  }
  
  abrirConfirmacaoDeletar(pessoa: Pessoa) {
    const dialogRef = this.dialog.open(ModalConfirmacaoComponent, {
      width: '300px',
      data: { nome: pessoa.nome }
    });

    dialogRef.afterClosed().subscribe((confirmado) => {
      if (confirmado) {
        this.deletePessoa(pessoa.id!); // Exclui a pessoa caso confirmado
      }
    });
  }

  deletePessoa(id: number) {
    this.databaseService.deletePessoa(id).subscribe(() => {
      this.loadPessoas();
    });
  }

  toggleForm(){
    this.showForm = !this.showForm;
  }
}
