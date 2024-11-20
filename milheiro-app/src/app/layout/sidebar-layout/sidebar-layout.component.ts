// sidebar-layout.component.ts
import { Component, OnInit } from '@angular/core';
import { DatabaseService, Pessoa } from '../../services/database.service';

@Component({
  selector: 'app-sidebar-layout',
  templateUrl: './sidebar-layout.component.html',
  styleUrls: ['./sidebar-layout.component.css']
})
export class SidebarLayoutComponent implements OnInit {
  pessoaSelecionada: string = 'Selecione';
  pessoas: Pessoa[] = []

  constructor(private databaseService: DatabaseService) {}

  ngOnInit(): void {
    this.databaseService.getPessoas().subscribe(pessoas=>{
      this.pessoas = pessoas;
    });
    this.databaseService.pessoaSelecionada$.subscribe(pessoa => {
      this.pessoaSelecionada = pessoa ? pessoa.nome : 'Selecione';
    });
  }

  selecionarPessoa(pessoa: Pessoa) {
    this.databaseService.selectPessoa(pessoa.id!).subscribe(() => {
      this.pessoaSelecionada = pessoa.nome;
    });
  }
  
}
