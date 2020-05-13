import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthService} from "../../service";
import {Credentials} from "../../dto/credentials";
import {Router} from "@angular/router";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  showError = false;
  hide = true;
  cred: Credentials = {userName: '', password: ''};
  isLoggedIn: boolean;

  constructor(private authService: AuthService, private router: Router) {

  }

  tryAuth() {
    console.log("Before" + this.isLoggedIn)
    this.authService.login(this.cred.userName, this.cred.password)
      .subscribe(result => {
        console.log(result);
        this.showError = false;
        this.router.navigateByUrl('/');
        console.log("Success" + this.isLoggedIn)
      }, error => {
        console.log(error);
        if (error.status != 200) {
          console.log("Error" + this.isLoggedIn)

          this.showError = true;
        }
      });
  }
}
