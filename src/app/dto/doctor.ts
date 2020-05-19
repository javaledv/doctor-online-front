import {BaseDto} from "./base-dto";
import {DoctorSpecialization} from "./doctor-specialization";
import {Timetable} from "./timetable";

export class Doctor extends BaseDto {
  firstName: string;
  middleName: string;
  lastName: string;
  doctorSpecialization: DoctorSpecialization;
  cabinet: string;
  ticketsInfo: Timetable
}
