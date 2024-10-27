import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';
import { HomeComponent } from './pages/home/home.component';

const dbConfig: DBConfig = {
  name: 'MilhasDB',
  version: 1,
  objectStoresMeta: [
    {
      store: 'pessoas',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'nome', keypath: 'nome', options: { unique: false } },
        { name: 'email', keypath: 'email', options: { unique: false } },
      ]
    },
    {
      store: 'pontos_milhas',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'pessoa', keypath: 'pessoa', options: { unique: false } },
        { name: 'plataforma', keypath: 'plataforma', options: { unique: false } },
        { name: 'pontos', keypath: 'pontos', options: { unique: false } },
        { name: 'valor', keypath: 'valor', options: { unique: false } },
        { name: 'media', keypath: 'media', options: { unique: false } },
        { name: 'origem', keypath: 'origem', options: { unique: false } },
        { name: 'data', keypath: 'data', options: { unique: false } },
        { name: 'created_by', keypath: 'created_by', options: { unique: false } },
        { name: 'created_at', keypath: 'created_at', options: { unique: false } },
      ]
    },
    {
      store: 'transferencias',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'pessoa', keypath: 'pessoa', options: { unique: false } },
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
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    NgxIndexedDBModule.forRoot(dbConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
