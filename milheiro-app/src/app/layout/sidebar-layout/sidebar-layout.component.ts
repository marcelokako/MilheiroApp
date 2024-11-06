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

  constructor(private databaseService: DatabaseService) {}

  ngOnInit(): void {
    this.carregarPessoaSelecionada();
  }

  carregarPessoaSelecionada() {
    this.databaseService.getPessoaSelecionada().subscribe(
      (pessoa: Pessoa | undefined) => {
        if (pessoa) {
          this.pessoaSelecionada = pessoa.nome;
        } else {
          this.databaseService.getPessoas().subscribe((pessoas) => {
            if (pessoas.length > 0) {
              this.pessoaSelecionada = 'Selecione';
            } else {
              this.pessoaSelecionada = 'Criar Pessoa';
            }
          });
        }
      },
      (error) => {
        console.error('Erro ao carregar pessoa selecionada:', error);
        this.pessoaSelecionada = 'Erro';
      }
    );
  }
}
