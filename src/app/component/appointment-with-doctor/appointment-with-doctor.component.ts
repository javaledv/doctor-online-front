import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {merge, Observable, of as observableOf} from "rxjs";
import {Doctor, DoctorSpecialization} from "../../dto";
import {DoctorSpecializationService} from "../../service/doctor-specialization/doctor-specialization.service";
import {TranslateService} from "@ngx-translate/core";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {catchError, map, startWith, switchMap} from "rxjs/operators";
import {DoctorService} from "../../service";

@Component({
  selector: 'appointment-with-doctor',
  templateUrl: './appointment-with-doctor.component.html',
  styleUrls: ['./appointment-with-doctor.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AppointmentWithDoctorComponent implements OnInit {

  specializationControl = new FormControl();
  specializations: DoctorSpecialization[] = [];
  filteredSpecializations: Observable<DoctorSpecialization[]>;
  selectedSpecialization: DoctorSpecialization;

  doctors: Doctor [] = [];
  columnsToDisplay = ['lastName', 'firstName', 'middleName', 'doctorSpecialization', 'cabinet'];
  expandedElement: Doctor | null;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  pageSize = 0;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  minDate: Date;
  maxDate: Date;
  date = new FormControl(new Date());


  ngOnInit(): void {
    this.updateTable()
  }

  constructor(private doctorSpecializationService: DoctorSpecializationService,
              private doctorService: DoctorService,
              private translate: TranslateService,) {
    this.doctorSpecializationService.getAll().subscribe(specializations => {
      let allName = '';
      translate.get('ALL').subscribe(value => allName = value);
      this.specializations.push({
        id: -1,
        localizedName: allName,
        code: -1
      });

      this.specializations = this.specializations.concat(specializations);
      this.filteredSpecializations = this.specializationControl.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.localizedName),
          map(localizedName => localizedName ? this._filter(localizedName) : this.specializations.slice())
        );
    }, error => console.log(error));

    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
  }

  displayFn(specialization: DoctorSpecialization): string {
    return specialization && specialization.localizedName ? specialization.localizedName : '';
  }

  private _filter(name: string): DoctorSpecialization[] {
    const filterValue = name.toLowerCase();

    return this.specializations.filter(option => option.localizedName.toLowerCase().indexOf(filterValue) === 0);
  }

  select(value) {
    this.selectedSpecialization = value;
    this.paginator.pageIndex = 0;
    this.updateTable();
  }

  createSearchParams(): string {

    let result = '?';

    if (this.selectedSpecialization != null && this.selectedSpecialization.id != -1) {
      result = result + `specializationId=${this.selectedSpecialization.id}&`;
    }

    return result;
  }

  updateTable() {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.doctorService!.list(this.createSearchParams(), this.paginator.pageIndex);
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.totalElements;
          this.pageSize = data.size;

          return data.content;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => {
      this.doctors = data;
    });
  }

  refreshDate(value) {
    console.log(value)
  }
}
