import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthService} from "../_service";
import {Credentials} from "../_models/credentials";
import {Router} from "@angular/router";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  hide = true;
  cred: Credentials = {userName: '', password: ''};

  constructor(private authService: AuthService, private router: Router) {
  }

  tryAuth() {
    this.authService.login(this.cred.userName, this.cred.password)
      .subscribe(result => {
        console.log(result);
        this.router.navigateByUrl('/');
      });
  }
}
