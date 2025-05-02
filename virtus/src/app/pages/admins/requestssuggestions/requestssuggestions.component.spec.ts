import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestssuggestionsComponent } from './requestssuggestions.component';

describe('RequestssuggestionsComponent', () => {
  let component: RequestssuggestionsComponent;
  let fixture: ComponentFixture<RequestssuggestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestssuggestionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestssuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
