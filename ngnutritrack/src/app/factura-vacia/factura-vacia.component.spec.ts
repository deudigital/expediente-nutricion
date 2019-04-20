import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaVaciaComponent } from './factura-vacia.component';

describe('FacturaVaciaComponent', () => {
  let component: FacturaVaciaComponent;
  let fixture: ComponentFixture<FacturaVaciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturaVaciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaVaciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
