import {Address} from "./address";

export class Patient {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: number;
  birthday: Date;
  phoneNumber: string;
  address: Address = new Address()
}
