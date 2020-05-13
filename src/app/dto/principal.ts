import {Role} from "./role";
import {BaseDto} from "./base-dto";

export class Principal extends BaseDto {
  email: string;
  roles?: Role[];
  password: string;
  active?: boolean;
  authData?: string;
}
