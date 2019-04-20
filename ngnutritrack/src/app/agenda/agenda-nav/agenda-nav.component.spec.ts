import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaNavComponent } from './agenda-nav.component';

describe('AgendaNavComponent', () => {
  let component: AgendaNavComponent;
  let fixture: ComponentFixture<AgendaNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
