import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPontosModalComponent } from './add-pontos-modal.component';

describe('AddPontosModalComponent', () => {
  let component: AddPontosModalComponent;
  let fixture: ComponentFixture<AddPontosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPontosModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPontosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
