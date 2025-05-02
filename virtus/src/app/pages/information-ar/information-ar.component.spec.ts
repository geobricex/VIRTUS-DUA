import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationArComponent } from './information-ar.component';

describe('InformationArComponent', () => {
  let component: InformationArComponent;
  let fixture: ComponentFixture<InformationArComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformationArComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationArComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
