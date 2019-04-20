import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitoComponent } from './habito.component';

describe('HabitoComponent', () => {
  let component: HabitoComponent;
  let fixture: ComponentFixture<HabitoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HabitoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
