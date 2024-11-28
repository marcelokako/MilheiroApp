import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculadoraModalComponent } from './calculadora-modal.component';

describe('CalculadoraModalComponent', () => {
  let component: CalculadoraModalComponent;
  let fixture: ComponentFixture<CalculadoraModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalculadoraModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculadoraModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
