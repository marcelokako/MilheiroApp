import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PessoasComponent } from './components/pessoas/pessoas.component';
import { ListaDetalhesPlataformaComponent } from './components/lista-detalhes-plataforma/lista-detalhes-plataforma.component';

const routes: Routes = [
  { path: '', pathMatch:'full', component: HomeComponent },
  { path: 'pessoas', component: PessoasComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard/:plataforma_id', component: ListaDetalhesPlataformaComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
