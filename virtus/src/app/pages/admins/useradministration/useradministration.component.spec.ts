import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseradministrationComponent } from './useradministration.component';

describe('UseradministrationComponent', () => {
  let component: UseradministrationComponent;
  let fixture: ComponentFixture<UseradministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UseradministrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseradministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
