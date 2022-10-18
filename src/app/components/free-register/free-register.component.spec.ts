import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeRegisterComponent } from './free-register.component';

describe('FreeRegisterComponent', () => {
  let component: FreeRegisterComponent;
  let fixture: ComponentFixture<FreeRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
