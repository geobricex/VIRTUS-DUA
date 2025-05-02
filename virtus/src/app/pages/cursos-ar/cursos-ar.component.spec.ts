import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursosArComponent } from './cursos-ar.component';

describe('CursosArComponent', () => {
  let component: CursosArComponent;
  let fixture: ComponentFixture<CursosArComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursosArComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CursosArComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
