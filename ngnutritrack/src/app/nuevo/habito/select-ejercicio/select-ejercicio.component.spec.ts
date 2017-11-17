import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectEjercicioComponent } from './select-ejercicio.component';

describe('SelectEjercicioComponent', () => {
  let component: SelectEjercicioComponent;
  let fixture: ComponentFixture<SelectEjercicioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectEjercicioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectEjercicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
