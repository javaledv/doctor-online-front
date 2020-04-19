import {Injectable} from '@angular/core';
import {User} from "../_models";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private httpClient: HttpClient) {
  }

  crete(user: User): Observable<User> {
    return this.httpClient.post<User>("/api/patient/create", user);
  }
}
