import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatologiaComponent } from './patologia.component';

describe('PatologiaComponent', () => {
  let component: PatologiaComponent;
  let fixture: ComponentFixture<PatologiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatologiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatologiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
