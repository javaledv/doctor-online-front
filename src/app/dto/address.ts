import {BaseDto} from "./base-dto";

export class Address extends BaseDto {
  city: string;
  street: string;
  houseNumber: string;
  apartment: string;
  index: string;
}
