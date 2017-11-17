import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadFisicaComponent } from './actividad-fisica.component';

describe('ActividadFisicaComponent', () => {
  let component: ActividadFisicaComponent;
  let fixture: ComponentFixture<ActividadFisicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActividadFisicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActividadFisicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
