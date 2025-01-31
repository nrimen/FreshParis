import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FontainesComponent } from './fontaines.component';

describe('FontainesComponent', () => {
  let component: FontainesComponent;
  let fixture: ComponentFixture<FontainesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FontainesComponent]
    });
    fixture = TestBed.createComponent(FontainesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
