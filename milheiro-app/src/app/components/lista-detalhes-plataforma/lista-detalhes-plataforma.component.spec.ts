import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaDetalhesPlataformaComponent } from './lista-detalhes-plataforma.component';

describe('ListaDetalhesPlataformaComponent', () => {
  let component: ListaDetalhesPlataformaComponent;
  let fixture: ComponentFixture<ListaDetalhesPlataformaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListaDetalhesPlataformaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaDetalhesPlataformaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
