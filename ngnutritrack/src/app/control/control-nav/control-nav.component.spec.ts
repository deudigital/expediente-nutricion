import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlNavComponent } from './control-nav.component';

describe('ControlNavComponent', () => {
  let component: ControlNavComponent;
  let fixture: ComponentFixture<ControlNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
