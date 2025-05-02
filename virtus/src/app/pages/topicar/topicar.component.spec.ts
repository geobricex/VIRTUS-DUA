import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicarComponent } from './topicar.component';

describe('TopicarComponent', () => {
  let component: TopicarComponent;
  let fixture: ComponentFixture<TopicarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
