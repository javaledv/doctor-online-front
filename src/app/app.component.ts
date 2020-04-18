import { Component } from '@angular/core';
import {User} from "./_models";
import {Router} from "@angular/router";
import {AuthService} from "./_service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'doctor-online-front';
  currentUser: User;

  constructor(
    private translateService: TranslateService,
    private router: Router,
    private authService: AuthService
  ) {
    this.authService.currentUser.subscribe(x => this.currentUser = x);
    this.translateService.setDefaultLang('ru');
    this.translateService.use('ru');
    this.authService.currentUser.subscribe(user => this.currentUser = user);
  }

  isAuthenticated() {
    return this.authService.isAuthenticated()
  }

  logout() {
    this.authService.logout();
  }

}
