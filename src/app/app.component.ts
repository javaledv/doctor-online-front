import {Component} from '@angular/core';
import {Principal} from "./dto";
import {Router} from "@angular/router";
import {AuthService} from "./service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'doctor-online-front';
  principal: Principal;

  constructor(
    private translateService: TranslateService,
    private router: Router,
    private authService: AuthService
  ) {
    this.authService.principal.subscribe(principal => this.principal = principal);
    this.translateService.setDefaultLang('ru');
    this.translateService.use('ru');
  }

  isAuthenticated() {
    return this.authService.isAuthenticated()
  }

  logout() {
    this.authService.logout();
  }
}
