import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPatronmenuComponent } from './modal-patronmenu.component';

describe('ModalPatronmenuComponent', () => {
  let component: ModalPatronmenuComponent;
  let fixture: ComponentFixture<ModalPatronmenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPatronmenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPatronmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
