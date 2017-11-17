import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatronmenuComponent } from './patronmenu.component';

describe('PatronmenuComponent', () => {
  let component: PatronmenuComponent;
  let fixture: ComponentFixture<PatronmenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatronmenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatronmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
