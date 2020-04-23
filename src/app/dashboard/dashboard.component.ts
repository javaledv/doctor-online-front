import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AuthService} from "../_service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {Patient} from "../_models/patient";

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  animal: string;
  name: string;

  ngOnInit(): void {
  }

  constructor(public dialog: MatDialog, private authService: AuthService) {
    if (!authService.currentUserValue.active) {
      this.openDialog()
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ProfileDialog, {
      height: '60%',
      width: '45%',
      data: {name: this.name, animal: this.animal},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

}

@Component({
  selector: 'profile-dialog',
  templateUrl: 'profile-dialog.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [
    {
      provide: MAT_DATE_LOCALE, useValue: 'ru-RU'
    },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class ProfileDialog implements OnInit {

  personalDataFormGroup: FormGroup;
  addressFormGroup: FormGroup;
  contactsFormGroup: FormGroup;

  isEditable = true;

  patient: Patient = new Patient();

  ngOnInit() {
    this.personalDataFormGroup = this._formBuilder.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      middleName: ['', Validators.required],
      gender: ['', Validators.required],
      birthday: ['', Validators.required]
    });
    this.addressFormGroup = this._formBuilder.group({
      city: ['', Validators.required],
      street: ['', Validators.required],
      houseNumber: ['', Validators.required],
    });
    this.contactsFormGroup = this._formBuilder.group({
      phoneNumber: ['', Validators.required],
      index: ['', Validators.required]
    });
  }

  constructor(public dialogRef: MatDialogRef<ProfileDialog>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private _formBuilder: FormBuilder,
              private authService: AuthService) {
  }

  onNoClick(): void {
    this.dialogRef.close();
    this.authService.logout();
  }
}
