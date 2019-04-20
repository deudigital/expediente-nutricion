import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtrosHabitosComponent } from './otros-habitos.component';

describe('OtrosHabitosComponent', () => {
  let component: OtrosHabitosComponent;
  let fixture: ComponentFixture<OtrosHabitosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtrosHabitosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtrosHabitosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
