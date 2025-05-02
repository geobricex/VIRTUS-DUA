import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScorereportComponent } from './scorereport.component';

describe('ScorereportComponent', () => {
  let component: ScorereportComponent;
  let fixture: ComponentFixture<ScorereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScorereportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScorereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
