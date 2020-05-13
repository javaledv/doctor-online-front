import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentWithDoctorComponent } from './appointment-with-doctor.component';

describe('DistrictDoctorComponent', () => {
  let component: AppointmentWithDoctorComponent;
  let fixture: ComponentFixture<AppointmentWithDoctorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentWithDoctorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentWithDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
