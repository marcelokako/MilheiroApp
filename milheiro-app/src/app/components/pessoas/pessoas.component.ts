// pessoas.component.ts
import { Component, OnInit } from '@angular/core';
import { DatabaseService, Pessoa } from '../../services/database.service';


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

  constructor(private databaseService: DatabaseService) {}

  ngOnInit(): void {
    this.loadPessoas();
  }

  loadPessoas() {
    this.databaseService.getPessoas().subscribe((p) => {
      this.pessoas = p;
    });
  }

  addPessoa() {
    const newPessoa: Pessoa = { nome: this.nome, email: this.email, selected: false };
    if(!newPessoa.nome || !newPessoa.email){
      alert("Informações de cadastro inválidas");
    } else {

      this.databaseService.addPessoa(newPessoa).subscribe({
        next: (idAdd) => {
          this.loadPessoas();
          this.nome = '';
          this.email = '';
          this.selected = false;
          
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


  deletePessoa(id: number) {
    this.databaseService.deletePessoa(id).subscribe(() => {
      this.loadPessoas();
    });
  }

  toggleForm(){
    this.showForm = !this.showForm;
  }
}
