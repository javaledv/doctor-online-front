import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DoctorSpecialization} from "../../dto";
import {AbstractBaseCrudService} from "../abstract-base-crud.service";

@Injectable({
  providedIn: 'root'
})
export class DoctorSpecializationService extends AbstractBaseCrudService<DoctorSpecialization> {

  constructor(httpClient: HttpClient) {
    super(httpClient)
  }

  getPath(): string {
    return "/api/doctor-specialization";
  }
}
