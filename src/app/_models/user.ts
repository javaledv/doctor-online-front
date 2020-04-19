import {Role} from "./role";

export class User {
  id: number;
  email: string;
  roles?: Role[];
  password: string;
  active?: boolean
  authdata?: string;
}
