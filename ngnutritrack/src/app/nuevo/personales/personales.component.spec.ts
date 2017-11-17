import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalesComponent } from './personales.component';

describe('PersonalesComponent', () => {
  let component: PersonalesComponent;
  let fixture: ComponentFixture<PersonalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
