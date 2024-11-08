import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
// import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RegistroMilhasComponent } from './pages/registro-milhas/registro-milhas.component';
import { PessoasComponent } from './components/pessoas/pessoas.component';

const routes: Routes = [
  { path: '', pathMatch:'full', component: HomeComponent },
  { path: 'pessoas', component: PessoasComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'registro-milhas', component: RegistroMilhasComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
