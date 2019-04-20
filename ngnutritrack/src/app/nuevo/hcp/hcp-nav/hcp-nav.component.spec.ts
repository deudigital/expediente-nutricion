import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HcpNavComponent } from './hcp-nav.component';

describe('HcpNavComponent', () => {
  let component: HcpNavComponent;
  let fixture: ComponentFixture<HcpNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HcpNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HcpNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
