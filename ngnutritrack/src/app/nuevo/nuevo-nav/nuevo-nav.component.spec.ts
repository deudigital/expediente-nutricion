import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoNavComponent } from './nuevo-nav.component';

describe('NuevoNavComponent', () => {
  let component: NuevoNavComponent;
  let fixture: ComponentFixture<NuevoNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevoNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
