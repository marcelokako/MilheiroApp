import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-pessoas',
  templateUrl: './pessoas.component.html',
  styleUrls: ['./pessoas.component.css']
})
export class PessoasComponent implements OnInit {

  pessoas: any[] = [];
  nome: string = '';
  email: string = '';

  constructor(private databaseService: DatabaseService) { }

  ngOnInit(): void {
    this.loadPessoas();
  }

  // Carregar todas as pessoas
  loadPessoas() {
    this.databaseService.getPessoas().subscribe((data) => {
      this.pessoas = data;
    });
  }

  // Adicionar uma nova pessoa
  addPessoa() {
    const newPessoa = { nome: this.nome, email: this.email };
    this.databaseService.addPessoa(newPessoa).subscribe(() => {
      this.loadPessoas(); // Recarregar a lista após adicionar
      this.nome = '';
      this.email = '';
    });
  }

  // Remover uma pessoa
  deletePessoa(id: number) {
    this.databaseService.deletePessoa(id).subscribe(() => {
      this.loadPessoas(); // Recarregar a lista após deletar
    });
  }
}
