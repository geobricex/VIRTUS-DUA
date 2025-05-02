import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestvoiceComponent } from './testvoice.component';

describe('TestvoiceComponent', () => {
  let component: TestvoiceComponent;
  let fixture: ComponentFixture<TestvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
