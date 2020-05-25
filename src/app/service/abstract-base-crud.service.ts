import {BaseDto} from "../dto";
import {BaseCrudService} from "./base-crud.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

export abstract class AbstractBaseCrudService<T extends BaseDto> implements BaseCrudService<T> {

  protected constructor(protected httpClient: HttpClient) {
  }

  byId(id: number): Observable<T> {
    return this.httpClient.get<T>(this.getPath() + "/" + id);
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(this.getPath() + "/" + id);
  }

  getAll(): Observable<T []> {
    return this.httpClient.get<T []>(this.getPath() + "/all");
  }

  list(searchParams: string, page: number): Observable<any> {
    const requestUrl = searchParams + `page=${page}`;
    return this.httpClient.get<any>(this.getPath() + "/list" + requestUrl);
  }

  listSort(searchParams: string, page: number, sort: string, order: string): Observable<any> {
    const requestUrl = searchParams + `page=${page}&sort=${sort},${order}`;
    return this.httpClient.get<any>(this.getPath() + "/list" + requestUrl);
  }

  save(dto: T): Observable<T> {
    return this.httpClient.post<T>(this.getPath() + "/save", dto);
  }

  abstract getPath(): string;
}
