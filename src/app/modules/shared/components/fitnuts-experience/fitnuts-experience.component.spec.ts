import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FitnutsExperienceComponent } from './fitnuts-experience.component';

describe('FitnutsExperienceComponent', () => {
  let component: FitnutsExperienceComponent;
  let fixture: ComponentFixture<FitnutsExperienceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FitnutsExperienceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FitnutsExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
