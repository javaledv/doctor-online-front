import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {mustMatch} from "../_helper";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  hidePassword = true;
  hideConfirmPassword = true;

  cred = {
    password: '',
    email: ''
  }

  constructor(private formBuilder: FormBuilder) {
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
    return this.registerForm.valid;
  }
}
