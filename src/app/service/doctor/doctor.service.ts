import {Injectable} from '@angular/core';
import {AbstractBaseCrudService} from "../abstract-base-crud.service";
import {Doctor} from "../../dto";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DoctorService extends AbstractBaseCrudService<Doctor> {

  constructor(httpClient: HttpClient) {
    super(httpClient)
  }

  getPath(): string {
    return "/api/doctor";
  }
}
