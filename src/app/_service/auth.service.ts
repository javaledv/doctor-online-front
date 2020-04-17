import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {User} from "../_models";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";
import {Router} from "@angular/router";

const AUTH_LOGIN_PATH = "/api/auth/login";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public currentUser: Observable<User>;
  private currentUserSubject: BehaviorSubject<User>;
  private _isAuthenticated: boolean;

  constructor(private httpClient: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();

    this.currentUser.subscribe(val => {
      this._isAuthenticated = val !== null;
    }, error => {
      this._isAuthenticated = false;
    })
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {

    let httpHeaders = new HttpHeaders({
      'Authorization': this.createBasicAuthToken(username, password),
      'X-Requested-With': 'XMLHttpRequest'
    });

    let options = {
      headers: httpHeaders
    };

    return this.httpClient.post<any>(AUTH_LOGIN_PATH, null, options)
      .pipe(map(user => {
        user.authdata = window.btoa(username + ':' + password);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  isAuthenticated() {
    return this._isAuthenticated;
  }

  createBasicAuthToken(username: String, password: String) {
    return 'Basic ' + window.btoa(username + ":" + password)
  }


  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigateByUrl('/login')
  }
}
