import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntentreviewComponent } from './intentreview.component';

describe('IntentreviewComponent', () => {
  let component: IntentreviewComponent;
  let fixture: ComponentFixture<IntentreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntentreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntentreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
