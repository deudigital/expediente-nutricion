import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosProductosComponent } from './servicios-productos.component';

describe('ServiciosProductosComponent', () => {
  let component: ServiciosProductosComponent;
  let fixture: ComponentFixture<ServiciosProductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiciosProductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiciosProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
