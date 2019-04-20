import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultasSinFacturarComponent } from './consultas-sin-facturar.component';

describe('ConsultasSinFacturarComponent', () => {
  let component: ConsultasSinFacturarComponent;
  let fixture: ComponentFixture<ConsultasSinFacturarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultasSinFacturarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultasSinFacturarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
