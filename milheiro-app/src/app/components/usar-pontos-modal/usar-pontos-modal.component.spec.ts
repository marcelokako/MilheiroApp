import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsarPontosModalComponent } from './usar-pontos-modal.component';

describe('UsarPontosModalComponent', () => {
  let component: UsarPontosModalComponent;
  let fixture: ComponentFixture<UsarPontosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsarPontosModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsarPontosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
