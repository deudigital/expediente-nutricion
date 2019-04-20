import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlNavCenterComponent } from './control-nav-center.component';

describe('ControlNavCenterComponent', () => {
  let component: ControlNavCenterComponent;
  let fixture: ComponentFixture<ControlNavCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlNavCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlNavCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
