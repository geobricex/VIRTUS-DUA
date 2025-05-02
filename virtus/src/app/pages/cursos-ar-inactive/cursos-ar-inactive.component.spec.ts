import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursosArInactiveComponent } from './cursos-ar-inactive.component';

describe('CursosArInactiveComponent', () => {
  let component: CursosArInactiveComponent;
  let fixture: ComponentFixture<CursosArInactiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursosArInactiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CursosArInactiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
