import {Injectable} from '@angular/core';
import {AbstractBaseCrudService} from "../abstract-base-crud.service";
import {TicketInfo} from "../../dto/ticket-info";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TicketService extends AbstractBaseCrudService <TicketInfo> {

  constructor(httpClient: HttpClient) {
    super(httpClient)
  }

  getPath(): string {
    return "/api/ticket";
  }
}
