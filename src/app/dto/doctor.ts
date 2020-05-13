import {BaseDto} from "./base-dto";
import {DoctorSpecialization} from "./doctor-specialization";

export class Doctor extends BaseDto {
  firstName: string;
  middleName: string;
  lastName: string;
  doctorSpecialization: DoctorSpecialization;
  cabinet: string;
}
