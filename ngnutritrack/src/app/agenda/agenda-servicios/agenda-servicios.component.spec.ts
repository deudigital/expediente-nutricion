import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaServiciosComponent } from './agenda-servicios.component';

describe('AgendaServiciosComponent', () => {
  let component: AgendaServiciosComponent;
  let fixture: ComponentFixture<AgendaServiciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaServiciosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
