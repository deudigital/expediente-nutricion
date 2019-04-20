import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HcpComponent } from './hcp.component';

describe('HcpComponent', () => {
  let component: HcpComponent;
  let fixture: ComponentFixture<HcpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HcpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HcpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
