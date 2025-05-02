import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesarComponent } from './resourcesar.component';

describe('ResourcesarComponent', () => {
  let component: ResourcesarComponent;
  let fixture: ComponentFixture<ResourcesarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourcesarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcesarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
