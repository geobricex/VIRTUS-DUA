import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestpocketbaseComponent } from './testpocketbase.component';

describe('TestpocketbaseComponent', () => {
  let component: TestpocketbaseComponent;
  let fixture: ComponentFixture<TestpocketbaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestpocketbaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestpocketbaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
