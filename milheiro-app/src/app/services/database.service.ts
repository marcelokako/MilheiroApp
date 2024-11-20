import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Pessoa {
  id?: number;
  nome: string;
  email: string;
  selected: boolean;
}
export interface Plataforma {
  id?: number;
  pessoa_id: number,
  created_by: number,
  plataforma: string,
  pontos: number,
  valor_total: number,
  custo_ponto: number,
  created_at: string,
  updated_at: string,
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

  // ----------------------- PESSOA ----------------------- //
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
        
        this.dbService.bulkPut("pessoas", pessoas).subscribe({
          next: () => {
            const novaPessoaSelecionada = pessoas.find((p) => p.selected) || null;
            this.pessoaSelecionadaSubject.next(novaPessoaSelecionada);
            observer.next();
            observer.complete();
          },
          error: (e) => {
            observer.error(e);
          }
        });
      });
    });
  }

  // ----------------------- PLATAFORMA ----------------------- //
  addPlataforma(plataforma: Plataforma): Observable<Plataforma>{
    return new Observable<Plataforma>((observer)=>{
      this.dbService.add<Plataforma>('plataformas', plataforma).subscribe({
        next: (plataforma) => {
          observer.next(plataforma);
          observer.complete();
        },
        error: (e) => observer.error(e)
      });
    }) 
  }

  getPlataformasPessoa(pessoa_id: number): Observable<Plataforma[]>{
    return this.dbService.getAllByIndex("plataformas", "pessoa_id", IDBKeyRange.only(pessoa_id));
  }
}
