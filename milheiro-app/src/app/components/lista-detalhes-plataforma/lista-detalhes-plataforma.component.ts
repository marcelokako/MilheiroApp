import { Component } from '@angular/core';
import { DatabaseService, Plataforma, PontoMilha } from '../../services/database.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lista-detalhes-plataforma',
  templateUrl: './lista-detalhes-plataforma.component.html',
  styleUrl: './lista-detalhes-plataforma.component.css'
})
export class ListaDetalhesPlataformaComponent {
  plataforma_id: number = 0;
  plataforma!: Plataforma;
  pontos_milhas: PontoMilha[] = [];
  pontos_recorrencia: any[] = [];

  constructor(
    private databaseService: DatabaseService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.plataforma_id = Number(this.route.snapshot.paramMap.get('plataforma_id'));
    this.databaseService.getPlataforma(this.plataforma_id).subscribe((plataforma)=>{
      this.plataforma = plataforma;
    });
    this.databaseService.getRegistrosPlataforma(this.plataforma_id).subscribe((pontos_milhas)=>{
      this.pontos_milhas = pontos_milhas;
    });
    this.databaseService.getRecorrenciasPlataforma(this.plataforma_id).subscribe((pontos_recorrencia)=>{
      this.pontos_recorrencia = pontos_recorrencia;
    });
  }
}

