import {Injectable} from '@angular/core';
import {User} from "../_models";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Patient} from "../_models/patient";

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private httpClient: HttpClient) {
  }

  crete(user: User): Observable<User> {
    return this.httpClient.post<User>("/api/patient/create", user);
  }

  save(patient: Patient): Observable<Patient> {
    return this.httpClient.post<Patient>("/api/patient/save", patient);
  }
}
