import {BaseDto} from "../dto";
import {Observable} from "rxjs";

export interface BaseCrudService<T extends BaseDto> {

  getAll(): Observable<T []>;

  byId(id: number): Observable<T>;

  delete(id: number): void;
}
