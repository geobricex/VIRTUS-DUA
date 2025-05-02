import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionNuComponent } from './question-nu.component';

describe('QuestionNuComponent', () => {
  let component: QuestionNuComponent;
  let fixture: ComponentFixture<QuestionNuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionNuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionNuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
