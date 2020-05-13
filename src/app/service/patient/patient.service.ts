import {Injectable} from '@angular/core';
import {Principal} from "../../dto";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Patient} from "../../dto/patient";
import {AbstractBaseCrudService} from "../abstract-base-crud.service";

@Injectable({
  providedIn: 'root'
})
export class PatientService extends AbstractBaseCrudService<Patient> {
  constructor(httpClient: HttpClient) {
    super(httpClient)
  }

  crete(user: Principal): Observable<Principal> {
    return this.httpClient.post<Principal>(this.getPath() + "/create", user);
  }

  getPath(): string {
    return "/api/patient";
  }
}
