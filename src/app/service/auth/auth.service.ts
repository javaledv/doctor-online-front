import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {Principal} from "../../dto";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";

const AUTH_LOGIN_PATH = "/api/auth/login";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public principal: Observable<Principal>;

  private _principalSubject: BehaviorSubject<Principal>;
  private _isAuthenticated: boolean;

  constructor(private httpClient: HttpClient, private router: Router, private cookieService: CookieService) {
    this._principalSubject = new BehaviorSubject<Principal>(JSON.parse(localStorage.getItem('currentUser')));
    this.principal = this._principalSubject.asObservable();

    this.principal.subscribe(val => {
      this._isAuthenticated = val !== null;
    }, error => {
      this._isAuthenticated = false;
    })
  }

  public get principalValue(): Principal {
    return this._principalSubject.value;
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
      .pipe(map(principal => {
        principal.authData = window.btoa(username + ':' + password);
        localStorage.setItem('currentUser', JSON.stringify(principal));
        this._principalSubject.next(principal);
        return principal;
      }));
  }

  isAuthenticated() {
    return this._isAuthenticated;
  }

  private createBasicAuthToken(username: String, password: String) {
    return 'Basic ' + window.btoa(username + ":" + password)
  }

  logout() {
    this.httpClient.post("/api/auth/logout", null)
      .subscribe(response => {
        console.log("Logout ok ")
        this.localLogout()
      }, error => {
        console.log("Logout error")
        this.localLogout()
      })
  }

  localLogout() {
    localStorage.removeItem('currentUser');
    this._principalSubject.next(null);
    this.cookieService.deleteAll();
    this.router.navigateByUrl('/login')
  }
}
