import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../_models";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) {
  }

  crete(user: User): Observable<User> {
    return this.httpClient.post<User>("/api/user/create", user);
  }
}
