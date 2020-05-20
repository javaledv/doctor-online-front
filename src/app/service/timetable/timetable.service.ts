import {Injectable} from '@angular/core';
import {AbstractBaseCrudService} from "../abstract-base-crud.service";
import {Timetable} from "../../dto/timetable";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Moment} from "moment";

@Injectable({
  providedIn: 'root'
})
export class TimetableService extends AbstractBaseCrudService<Timetable> {

  constructor(httpClient: HttpClient) {
    super(httpClient)
  }

  getIdBy(moment: Moment, doctorId: number): Observable<number> {
    let params = {
      "date": moment.format("YYYY-MM-DD"),
      "doctorId": String(doctorId)
    };

    return this.httpClient.get<number>(this.getPath() + "/id", {params: params});
  }

  getPath(): string {
    return "/api/timetable";
  }
}
