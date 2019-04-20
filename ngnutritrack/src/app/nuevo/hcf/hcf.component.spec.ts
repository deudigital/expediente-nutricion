import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HcfComponent } from './hcf.component';

describe('HcfComponent', () => {
  let component: HcfComponent;
  let fixture: ComponentFixture<HcfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HcfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HcfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
