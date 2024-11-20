import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlataformaModalComponent } from './plataforma-modal.component';

describe('PlataformaModalComponent', () => {
  let component: PlataformaModalComponent;
  let fixture: ComponentFixture<PlataformaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlataformaModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlataformaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
