import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValoracionDieteticaComponent } from './valoracion-dietetica.component';

describe('ValoracionDieteticaComponent', () => {
  let component: ValoracionDieteticaComponent;
  let fixture: ComponentFixture<ValoracionDieteticaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValoracionDieteticaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValoracionDieteticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
