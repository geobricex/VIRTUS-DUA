import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloarComponent } from './moduloar.component';

describe('ModuloarComponent', () => {
  let component: ModuloarComponent;
  let fixture: ComponentFixture<ModuloarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuloarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuloarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
