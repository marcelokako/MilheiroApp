import { Component } from '@angular/core';
import { DatabaseService, Plataforma } from '../../services/database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css', '../../components/pessoas/pessoas.component.css']
})
export class DashboardComponent {
  plataformas: Plataforma[] = [];
  pessoaSelecionada_id: number = 0;

  constructor(
    private databaseService: DatabaseService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.databaseService.pessoaSelecionada$.subscribe(pessoa => {
      if(!!pessoa && (pessoa.id??0 > 0)){
        this.pessoaSelecionada_id = pessoa.id??0;
        this.loadPlataformas(pessoa.id??0);
      }
    });
    
  }
  
  loadPlataformas(pessoa_id: number) {
    this.databaseService.getPlataformasPessoa(pessoa_id).subscribe((plataformas) => {
      this.plataformas = plataformas;
    });
  }

  abrirListaDetalhesPlataforma(plataforma_id: number){
    if(plataforma_id == 0){
      return;
    }
    this.router.navigate(['/dashboard', plataforma_id]);
  }
}

