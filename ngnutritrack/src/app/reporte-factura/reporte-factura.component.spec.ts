import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepoteFacturaComponent } from './reporte-factura.component';

describe('ReporteFacturaComponent', () => {
  let component: ReporteFacturaComponent;
  let fixture: ComponentFixture<ReporteFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepoteFacturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepoteFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
