import { TestBed } from '@angular/core/testing';

import { CargarScriptsService } from './cargar-scripts.service';
import {  CargarJson } from './cargar-json';

describe('CargarScriptsService', () => {
  let service: CargarScriptsService;
  let servicieCursos: CargarJson;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CargarScriptsService);
    servicieCursos = TestBed.inject(CargarJson);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
