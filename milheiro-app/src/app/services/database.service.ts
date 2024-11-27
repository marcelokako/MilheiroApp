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
  pessoa_id: number;
  created_by: number;
  plataforma: string;
  pontos: number;
  valor_total: number;
  custo_ponto: number;
  created_at: string;
  updated_at: string;
}
export interface PontoMilha {
  id?: number;
  pessoa_id: number;
  plataforma_id: number;
  pontos: number;
  valor: number;
  custo_ponto: number;
  descricao: string;
  data: string;
  data_expiracao: string;
  created_at: string;
  created_by: string;
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

  // ----------------------- PONTOS ----------------------- //
  AddPonto(obj_ponto: PontoMilha): Observable<PontoMilha>{    
    return new Observable<PontoMilha>((observer)=>{
      this.dbService.add<PontoMilha>('pontos_milhas', obj_ponto).subscribe({
        next: (obj_ponto) => {
          
          this.recalcularTotaisPlataforma(obj_ponto.plataforma_id, obj_ponto.pessoa_id);
          observer.next(obj_ponto); 
          observer.complete();
        },
        error: (e) => observer.error(e)
      });
    }) 
  }

  recalcularTotaisPlataforma(plataforma_id: number, pessoa_id: number) {    
    return this.dbService
      .getAllByIndex('pontos_milhas', 'plataforma_id', IDBKeyRange.only(plataforma_id))
      .subscribe({
        next: (registrosPontos: any) => {
          const dataHoje = new Date();
  
          const todosPontosPlataforma = registrosPontos.filter((registroPontos: any) => {
            const flag_pessoa_id = registroPontos.pessoa_id === pessoa_id;
            const flag_data_expiracao =
              !registroPontos.data_expiracao || new Date(registroPontos.data_expiracao) > dataHoje;
  
            return flag_pessoa_id && flag_data_expiracao;
          });
  
          const total_pontos = todosPontosPlataforma.reduce((acc: any, p: any) => acc + Number(p.pontos), 0);
          const total_custo = todosPontosPlataforma.reduce((acc: any, p: any) => acc + Number(p.valor_total), 0);
          const custo_ponto = total_custo > 0 ? (total_pontos / total_custo).toFixed(2) : 0;

          this.dbService.getByID('plataformas', plataforma_id).subscribe({
            
            next: (plataforma: any) => {
              if (plataforma) {
                plataforma.pontos = total_pontos;
                plataforma.valor_total = total_custo;
                plataforma.custo_ponto = custo_ponto;

                this.dbService.update('plataformas', plataforma).subscribe((storeData) => {
                });
                
              } else {
                console.warn(`Plataforma com ID ${plataforma_id} não encontrada.`);
              }
            },
            error: (err) =>{
              console.warn(`Erro ao atualizar plataforma com ID ${plataforma_id}.`);
            }
          });
        },
        error: (err) => {
          console.error('Erro ao recalcular totais da plataforma:', err);
        },
      });
  }
  
}
