import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitoNavComponent } from './habito-nav.component';

describe('HabitoNavComponent', () => {
  let component: HabitoNavComponent;
  let fixture: ComponentFixture<HabitoNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HabitoNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitoNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
