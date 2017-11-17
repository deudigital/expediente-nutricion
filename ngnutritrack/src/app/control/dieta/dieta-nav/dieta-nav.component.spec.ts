import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DietaNavComponent } from './dieta-nav.component';

describe('DietaNavComponent', () => {
  let component: DietaNavComponent;
  let fixture: ComponentFixture<DietaNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DietaNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DietaNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
