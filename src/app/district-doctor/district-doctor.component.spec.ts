import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictDoctorComponent } from './district-doctor.component';

describe('DistrictDoctorComponent', () => {
  let component: DistrictDoctorComponent;
  let fixture: ComponentFixture<DistrictDoctorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistrictDoctorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistrictDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
