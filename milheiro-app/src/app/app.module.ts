import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgxIndexedDBModule, DBConfig, NgxIndexedDBService } from 'ngx-indexed-db';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RegistroMilhasComponent } from './pages/registro-milhas/registro-milhas.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarLayoutComponent } from './layout/sidebar-layout/sidebar-layout.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon'
import { PessoasComponent } from './components/pessoas/pessoas.component';
import { ModalConfirmacaoComponent } from './components/modal-confirmacao/modal-confirmacao.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { PessoaModalComponent } from './components/pessoa-modal/pessoa-modal.component';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { PlataformaModalComponent } from './components/plataforma-modal/plataforma-modal.component';
import { AddPontosModalComponent } from './components/add-pontos-modal/add-pontos-modal.component';


const dbConfig: DBConfig = {
  name: 'MilhasDB',
  version: 3,
  objectStoresMeta: [
    {
      store: 'pessoas',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'nome', keypath: 'nome', options: { unique: true } },
        { name: 'email', keypath: 'email', options: { unique: false } },
        { name: 'selected', keypath: 'selected', options: { unique: false } },
      ]
    },
    {
      store: 'plataformas',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'plataforma', keypath: 'plataforma', options: { unique: false } },
        { name: 'pessoa_id', keypath: 'pessoa_id', options: { unique: false } },
        { name: 'pontos', keypath: 'pontos', options: { unique: false } },
        { name: 'valor_total', keypath: 'valor_total', options: { unique: false } },
        { name: 'custo_ponto', keypath: 'custo_ponto', options: { unique: false } },
        { name: 'updated_at', keypath: 'data', options: { unique: false } },
        { name: 'created_by', keypath: 'created_by', options: { unique: false } },
        { name: 'created_at', keypath: 'created_at', options: { unique: false } },
      ]
    },
    {
      store: 'pontos_milhas',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'pessoa_id', keypath: 'pessoa_id', options: { unique: false } },
        { name: 'plataforma_id', keypath: 'plataforma_id', options: { unique: false } },
        { name: 'pontos', keypath: 'pontos', options: { unique: false } },
        { name: 'valor', keypath: 'valor', options: { unique: false } },
        { name: 'custo_ponto', keypath: 'custo_ponto', options: { unique: false } },
        { name: 'descricao', keypath: 'descricao', options: { unique: false } },
        { name: 'data', keypath: 'data', options: { unique: false } },
        { name: 'data_expiracao', keypath: 'data_expiracao', options: { unique: false } },
        { name: 'created_by', keypath: 'created_by', options: { unique: false } },
        { name: 'created_at', keypath: 'created_at', options: { unique: false } },
      ]
    },
    {
      store: 'transferencias',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'pessoa_id', keypath: 'pessoa_id', options: { unique: false } },
        { name: 'plataforma_origem', keypath: 'plataforma_origem', options: { unique: false } },
        { name: 'plataforma_destino', keypath: 'plataforma_destino', options: { unique: false } },
        { name: 'pontos', keypath: 'pontos', options: { unique: false } },
        { name: 'taxa', keypath: 'taxa', options: { unique: false } },
        { name: 'observacao', keypath: 'observacao', options: { unique: false } },
        { name: 'data', keypath: 'data', options: { unique: false } },
        { name: 'created_by', keypath: 'created_by', options: { unique: false } },
        { name: 'created_at', keypath: 'created_at', options: { unique: false } },
      ]
    },
  ]
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    RegistroMilhasComponent,
    SidebarLayoutComponent,
    PessoasComponent,
    ModalConfirmacaoComponent,
    PessoaModalComponent,
    PlataformaModalComponent,
    AddPontosModalComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    CommonModule,
    MatListModule,
    FormsModule,
    MatLabel,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatMenuModule,
    MatMenuTrigger,
    RouterModule.forRoot([]),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    NgxIndexedDBModule.forRoot(dbConfig)
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(private ngxIndexedDBService: NgxIndexedDBService){
    this.ngxIndexedDBService = ngxIndexedDBService;
  }
}
