import {Address} from "./address";
import {BaseDto} from "./base-dto";

export class Patient extends BaseDto {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: number;
  birthday: Date;
  phoneNumber: string;
  address: Address = new Address()
}
