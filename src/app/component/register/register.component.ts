import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {mustMatch} from "../../helper";
import {Principal} from "../../dto";
import {Router} from "@angular/router";
import {AuthService} from "../../service";
import {PatientService} from "../../service/patient/patient.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  hidePassword = true;
  hideConfirmPassword = true;

  user: Principal = {
    id: null,
    password: '',
    email: ''
  };

  registerInProgress = false;
  showRegisterError = false;

  constructor(private formBuilder: FormBuilder, private patientService: PatientService, private router: Router, private authService: AuthService) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: mustMatch('password', 'confirmPassword')
    });
  }

  ngOnInit(): void {
  }

  get f() {
    return this.registerForm.controls;
  }

  register() {
    const email = this.user.email;
    const password = this.user.password;
    this.registerInProgress = true;
    this.showRegisterError = false;

    this.patientService.crete(this.user)
      .subscribe(result => {
        console.log('User created: ' + result);
        this.authService.login(email, password).subscribe(
          result => {
            console.log("Success login " + email);
            this.router.navigateByUrl('/')
            this.registerInProgress = false;
          }, error => {
            console.log("Failing login " + email);
            this.router.navigateByUrl('/login')
            this.registerInProgress = false;
          }
        );
      }, error => {
        if(error.error.error_code == 4) {
          console.log('HERE Error:' + error);
          this.showRegisterError = true;
        }
        this.registerInProgress = false;
      })
  }

  getErrorMessage(controlName) {
    if (controlName == 'email') {
      return this.f.email.hasError('email') ? 'NOT_VALID_EMAIL' : '';
    } else if (controlName == 'password') {
      return this.f.password.hasError('minlength') ? 'NOT_VALID_PASSWORD_LENGTH' : '';
    } else if (controlName == 'confirmPassword') {
      return this.f.confirmPassword.hasError('mustMatch') ? 'NOT_VALID_PASSWORD_EQUALS' : '';
    }
  }

  isCanSubmit() {
    return this.registerForm.valid && !this.registerInProgress;
  }
}
