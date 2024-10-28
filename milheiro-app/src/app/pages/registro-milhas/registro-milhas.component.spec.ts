import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroMilhasComponent } from './registro-milhas.component';

describe('RegistroMilhasComponent', () => {
  let component: RegistroMilhasComponent;
  let fixture: ComponentFixture<RegistroMilhasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistroMilhasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroMilhasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
