import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreenSpacesComponent } from './green-spaces.component';

describe('GreenSpacesComponent', () => {
  let component: GreenSpacesComponent;
  let fixture: ComponentFixture<GreenSpacesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GreenSpacesComponent]
    });
    fixture = TestBed.createComponent(GreenSpacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
