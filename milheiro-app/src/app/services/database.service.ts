import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { BehaviorSubject, Observable } from 'rxjs';

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
  private pessoaSelecionadaSubject = new BehaviorSubject<Pessoa | null>(null);
  pessoaSelecionada$ = this.pessoaSelecionadaSubject.asObservable();

  constructor(private dbService: NgxIndexedDBService) {
    this.getPessoaSelecionada();
  }

  getPessoas(): Observable<Pessoa[]> {
    return this.dbService.getAll<Pessoa>('pessoas');
  }

  private getPessoaSelecionada() {
    this.getPessoas().subscribe((pessoas) => {
      const pessoaSelecionada = pessoas.find((p) => p.selected) || null;
      this.pessoaSelecionadaSubject.next(pessoaSelecionada);
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

  selectPessoa(id: number): Observable<void>{
    return new Observable<void>((observer)=>{
      this.getPessoas().subscribe((pessoas)=>{
        pessoas.forEach((p) => (p.selected = p.id === id));

        Promise.all(pessoas.map((p) => this.dbService.update('pessoas', p)))
          .then(() => {
            const novaPessoaSelecionada = pessoas.find((p) => p.selected) || null;
            this.pessoaSelecionadaSubject.next(novaPessoaSelecionada);
            observer.next();
            observer.complete();
          })
          .catch((e)=> observer.error(e));
      });
    });
  }
}
