import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';

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
  data_aquisicao: string;
  data_expiracao?: string;
  created_at: string;
  created_by: string;
  recorrencia_id?: number;
  recorrencia_tipo: "N" | "M" | "A";
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
      const dataAquisicao = new Date(obj_ponto.data_aquisicao);

      // VERIFICA SE HOUVE RECORRENCIA
      if(["M", "A"].includes(obj_ponto.recorrencia_tipo)){

        const novaRecorrencia = {
          recorrencia_tipo: obj_ponto.recorrencia_tipo,
          ultima_criacao: dataAquisicao.toISOString().split('T')[0],
          proxima_criacao: obj_ponto.recorrencia_tipo == "M"
            ? new Date(dataAquisicao.setMonth(dataAquisicao.getMonth() + 1)).toISOString().split('T')[0]
            : new Date(dataAquisicao.setFullYear(dataAquisicao.getFullYear() + 1)).toISOString().split('T')[0],
          pessoa_id: obj_ponto.pessoa_id,
          plataforma_id: obj_ponto.plataforma_id,
          pontos: obj_ponto.pontos,
          valor: obj_ponto.valor,
          descricao: obj_ponto.descricao,
          created_by: obj_ponto.created_by,
          created_at: obj_ponto.created_at,
        };

        this.dbService.add("pontos_recorrencia", novaRecorrencia).subscribe({
          next: (recorrencia_id: any)=>{
            console.log('Registro recorrente criado:', novaRecorrencia);
            obj_ponto.recorrencia_id = recorrencia_id.id;
          },
          error: (err)=>{
            console.error('Erro ao criar registro recorrente:', err);
            observer.error(err); 
          }
        })
      }
      console.log("teste: recorrencia_id: ", obj_ponto);
      
      this.dbService.add<PontoMilha>('pontos_milhas', obj_ponto).subscribe({
        next: (novo_ponto) => {
          console.log('Ponto milha adicionado:', novo_ponto);

          this.recalcularTotaisPlataforma(novo_ponto.plataforma_id, novo_ponto.pessoa_id);
          observer.next(novo_ponto); 
          observer.complete();
        },
        error: (err) => {
          console.error('Erro ao adicionar ponto milha:', err);
          observer.error(err);
        }
      });

    }) 
  }

  recalcularTotaisPlataforma(plataforma_id: number, pessoa_id: number) {
    this.atualizarPontosRecorrentes(plataforma_id).subscribe({
      next: () => {
        this.dbService.getAllByIndex('pontos_milhas', 'plataforma_id', IDBKeyRange.only(plataforma_id))
        .subscribe({
          next: (registrosPontos: any) => {
            const dataHoje = new Date();
            console.log('registrosPontos capturados:', registrosPontos);

            const todosPontosPlataforma = registrosPontos.filter((registroPontos: any) => {
              const flag_pessoa_id = registroPontos.pessoa_id === pessoa_id;
              const flag_data_expiracao =
                !registroPontos.data_expiracao || new Date(registroPontos.data_expiracao) > dataHoje;
    
              return flag_pessoa_id && flag_data_expiracao;
            });
            console.log('registrosPontos filtrados:', todosPontosPlataforma);
           
            const total_pontos = todosPontosPlataforma.reduce((acc: any, p: any) => acc + Number(p.pontos), 0);
            const total_custo = todosPontosPlataforma.reduce((acc: any, p: any) => acc + Number(p.valor), 0);
            const custo_ponto = (1000*total_custo / total_pontos).toFixed(2);
          
            this.dbService.getByID('plataformas', plataforma_id).subscribe({
              next: (plataforma: any) => {
                console.log('plataforma a ser atualizada:', plataforma);

                if (plataforma) {
                  plataforma.pontos = total_pontos;
                  plataforma.valor_total = total_custo;
                  plataforma.custo_ponto = custo_ponto;

                  this.dbService.update('plataformas', plataforma).subscribe((storeData) => {
                    console.log("storeData: ", storeData);
                    
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
    });
  }
  
  atualizarPontosRecorrentes(plataforma_id: any): Observable<void> {
    const dataHoje = new Date();
    
    return new Observable((observer)=>{
      this.dbService.getAllByIndex('pontos_recorrencia', 'plataforma_id', IDBKeyRange.only(plataforma_id))
      .subscribe((recorrencias: any[]) => {
        console.log('pontos_recorrencia capturados:', recorrencias);
        if (recorrencias.length === 0) {
          console.log('Nenhuma recorrência encontrada para a plataforma:', plataforma_id);
          observer.next();
          observer.complete();
          return;
        }

        const processarRecorrencias = recorrencias.map((recorrencia) => {
          const dataProxima = new Date(recorrencia.proxima_criacao);
    
          if (dataHoje >= dataProxima) {
            console.log('entrou datahj > dataproxima');

            const novoRegistro = { // FALTA UM MÓI DE COLUNA PRA CÁ, VAI POSSIVELMENTE CORRIGIR UM BUG QUE ATUALIZA REGISTRO PRA ANUAL PQ N TEM RECORRENCIA TIPO AQUI DENTRO
              pessoa_id: recorrencia.pessoa_id,
              plataforma_id: recorrencia.plataforma_id,
              data_criacao: dataHoje.toISOString().split('T')[0],
              data_expiracao: recorrencia.recorrencia === 'M'
                ? new Date(dataProxima.setMonth(dataProxima.getMonth() + 1)).toISOString().split('T')[0] // MENSALMENTE
                : new Date(dataProxima.setFullYear(dataProxima.getFullYear() + 1)).toISOString().split('T')[0], // ANUALMENTE
              pontos: recorrencia.pontos,
              valor: recorrencia.valor,
              recorrencia_id: recorrencia.id,
            };
            
            return new Observable<void>((subObserver) => {
              this.dbService.add('pontos_milhas', novoRegistro).subscribe({
                next: () =>{    
                  console.log('novoRegistro: ', novoRegistro);

                  recorrencia.ultima_criacao = dataHoje.toISOString().split('T')[0];
                  recorrencia.proxima_criacao = novoRegistro.data_expiracao;
                  this.dbService.update('pontos_recorrencia', recorrencia).subscribe({
                    next: () => {
                      console.log('update_recorrencia: ', recorrencia);

                      subObserver.next();
                      subObserver.complete();
                    },
                    error: (err)=>{
                      console.error('Erro ao atualizar recorrência:', err);
                      subObserver.error(err);
                    }
                  });
                },
                error: (err)=>{
                  console.error('Erro ao criar novo registro:', err);
                  subObserver.error(err);
                },
              });
            });
          }

          return new Observable<void>((subObserver) => {
            console.log("subObserver.next()");
            subObserver.next();
            subObserver.complete();
          });
        });

        forkJoin(processarRecorrencias).subscribe({
          next: () => {
            console.log("observer.next()");
            observer.next();
            observer.complete();
          },
          error: (err) => {
            console.error('Erro ao processar recorrências:', err);
            observer.error(err);
          },
        });
      });
    });
  }


}
