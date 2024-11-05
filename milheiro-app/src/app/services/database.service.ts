import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private dbService: NgxIndexedDBService) { }

  // Adicionar uma nova pessoa
  addPessoa(pessoa: { nome: string; email: string }): Observable<any> {
    return this.dbService.add('pessoas', pessoa);
  }

  // Listar todas as pessoas
  getPessoas(): Observable<any[]> {
    return this.dbService.getAll('pessoas');
  }

  // Atualizar uma pessoa
  updatePessoa(id: number, pessoa: { nome: string; email: string }): Observable<any> {
    return this.dbService.update('pessoas', { id, ...pessoa });
  }

  // Deletar uma pessoa
  deletePessoa(id: number): Observable<any> {
    return this.dbService.delete('pessoas', id);
  }
}
