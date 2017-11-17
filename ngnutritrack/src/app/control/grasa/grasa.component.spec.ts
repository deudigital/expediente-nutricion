import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrasaComponent } from './grasa.component';

describe('GrasaComponent', () => {
  let component: GrasaComponent;
  let fixture: ComponentFixture<GrasaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrasaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrasaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
