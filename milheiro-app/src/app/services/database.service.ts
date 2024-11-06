import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable } from 'rxjs';

export interface Pessoa {
  id?: number;
  nome: string;
  email: string;
  selected: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(private dbService: NgxIndexedDBService) {}

  getPessoas(): Observable<Pessoa[]> {
    return this.dbService.getAll<Pessoa>('pessoas');
  }

  getPessoaSelecionada(): Observable<Pessoa | undefined> {
    return new Observable<Pessoa | undefined>((observer) => {
      this.dbService.getAll<Pessoa>('pessoas').subscribe((pessoas) => {
        const pessoaSelecionada = pessoas.find((pessoa) => pessoa.selected);
        observer.next(pessoaSelecionada);
        observer.complete();
      });
    });
  }

  addPessoa(pessoa: Pessoa): Observable<number> {
    return new Observable<number>((observer)=>{
      this.dbService.add<Pessoa>('pessoas', pessoa).subscribe({
        next: (pessoa) => {
          observer.next(pessoa.id);
          observer.complete();
        },
        error: (e) => observer.error(e)
      });
    }) 
  }

  deletePessoa(id: number): Observable<void> {
    return new Observable<void>((observer)=>{
      this.dbService.delete('pessoas', id).subscribe({
        next: ()=>{
          observer.next();
          observer.complete()
        },
        error: (e) => observer.error(e)
      });
    }) 
  }
}
