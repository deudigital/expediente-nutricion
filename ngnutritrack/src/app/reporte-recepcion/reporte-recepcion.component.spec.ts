import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteRecepcionComponent } from './reporte-factura.component';

describe('ReporteFacturaComponent', () => {
  let component: ReporteFacturaComponent;
  let fixture: ComponentFixture<ReporteFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteRecepcionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteRecepcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
