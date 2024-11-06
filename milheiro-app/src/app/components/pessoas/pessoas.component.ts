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

  constructor(private databaseService: DatabaseService) {}

  ngOnInit(): void {
    this.loadPessoas();
  }

  loadPessoas() {
    this.databaseService.getPessoas().subscribe((data) => {
      this.pessoas = data;
    });
  }

  addPessoa() {
    const newPessoa: Pessoa = { nome: this.nome, email: this.email, selected: false };
    this.databaseService.addPessoa(newPessoa).subscribe(() => {
      this.loadPessoas();
      this.nome = '';
      this.email = '';
      this.selected = false;
    });
  }

  deletePessoa(id: number) {
    this.databaseService.deletePessoa(id).subscribe(() => {
      this.loadPessoas();
    });
  }
}
