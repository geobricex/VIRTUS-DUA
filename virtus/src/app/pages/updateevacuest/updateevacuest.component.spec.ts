import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateevacuestComponent } from './updateevacuest.component';

describe('UpdateevacuestComponent', () => {
  let component: UpdateevacuestComponent;
  let fixture: ComponentFixture<UpdateevacuestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateevacuestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateevacuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
