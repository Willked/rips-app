import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RipsFormComponent } from './rips-form.component';

describe('RipsFormComponent', () => {
  let component: RipsFormComponent;
  let fixture: ComponentFixture<RipsFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RipsFormComponent]
    });
    fixture = TestBed.createComponent(RipsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
