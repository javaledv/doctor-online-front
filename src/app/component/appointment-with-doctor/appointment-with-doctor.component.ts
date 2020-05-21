import {Component, Inject, LOCALE_ID, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {merge, Observable, of as observableOf} from "rxjs";
import {Doctor, DoctorSpecialization} from "../../dto";
import {AuthService, DoctorService, DoctorSpecializationService} from "../../service";
import {TranslateService} from "@ngx-translate/core";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatPaginator} from "@angular/material/paginator";
import {catchError, map, startWith, switchMap} from "rxjs/operators";
import {SocketClientService} from "../../client/socket-client.service";
import {Ticket} from "../../dto/ticket";
import {TimetableService} from "../../service/timetable/timetable.service";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter
} from "@angular/material-moment-adapter";
import * as moment from 'moment'
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {TicketStatus} from "../../dto/ticket-status";

export interface DialogData {
  doctor: Doctor;
}

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
export class AppointmentWithDoctorComponent implements OnInit, OnDestroy {

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
    this.socketClientService.init();
    this.updateTable()
  }

  ngOnDestroy(): void {
    this.socketClientService.disconnect();
  }

  ticketCounts(counts) {
    this.socketClientService.onMessage("/topic/doctor/tickets")
      .subscribe(ticketsInfo => {
        counts.ticketsInfo = ticketsInfo
      });
    this.socketClientService.send("/topic/doctor/tickets/update", new Ticket());
  }

  constructor(private doctorSpecializationService: DoctorSpecializationService,
              private doctorService: DoctorService,
              private translate: TranslateService,
              private socketClientService: SocketClientService,
              private timetableService: TimetableService,
              public dialog: MatDialog) {
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

    this.minDate = new Date();
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + 29);
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
      for (let doctor of this.doctors) {
        this.timetableService.getIdBy(moment(new Date()), doctor.id).subscribe(id => {
          this.socketClientService.onMessage("/topic/timetable/" + id)
            .subscribe(ticketsInfo => {
              doctor.ticketsInfo = ticketsInfo
            });
          this.socketClientService.send("/app/timetable/" + id, null);
        })
      }
    });
  }

  count(doctor: Doctor) {
    return doctor.ticketsInfo.tickets.filter(ticket => ticket.ticketStatus === "OPENED").length
  }

  refreshDate(value, doctor) {
    console.log(value);
    this.timetableService.getIdBy(value, doctor.id).subscribe(id => {
      this.socketClientService.onMessage("/topic/timetable/" + id)
        .subscribe(ticketsInfo => {
          doctor.ticketsInfo = ticketsInfo
        });
      this.socketClientService.send("/app/timetable/" + id, null);
    })
  }

  openAppointmentDialog(doctor: Doctor): void {
    const dialogRef = this.dialog.open(AppointmentDialog, {
      height: '550px',
      width: '700px',
      disableClose: true,
      data: {
        doctor: doctor
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}

@Component({
  selector: 'appointment-dialog',
  templateUrl: 'appointment-dialog.html',
  styleUrls: ['./appointment-with-doctor.component.css'],
  providers: [{provide: LOCALE_ID, useValue: 'ru'}]
})

export class AppointmentDialog implements OnInit {

  selectedTicket: Ticket;

  ngOnInit() {
  }

  constructor(public dialogRef: MatDialogRef<AppointmentDialog>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private authService: AuthService,
              private socketClientService: SocketClientService) {
  }

  close(): void {
    if (this.selectedTicket) {
        this.selectedTicket.ticketStatus = "OPENED";
        this.socketClientService.send("/app/timetable/" + this.selectedTicket.timetableId + "/ticket/update", this.selectedTicket);

        this.selectedTicket = null;
    }
    this.dialogRef.close()
  }

  appointment() {
    if (this.selectedTicket) {
      this.selectedTicket.ticketStatus = "RESERVED";
      this.socketClientService.send("/app/timetable/" + this.selectedTicket.timetableId + "/ticket/update", this.selectedTicket);
    }
    this.dialogRef.close()
  }

  getBackgroundColor(ticket: Ticket): string {
    if (ticket.ticketStatus === "DONE" || (ticket.userId != this.authService.principalValue.id && ticket.ticketStatus === "SELECTED")) {
      return "#cccdce6b"
    } else if (ticket.ticketStatus === "RESERVED") {
      return "#cccdce6b"
    } else if (ticket.ticketStatus === "SELECTED") {
      return "#14e2243d"
    }
    return "#6babe23d";
  }

  selectTicket(ticket: Ticket) {

    if (ticket.ticketStatus != "OPENED") {
      return;
    }

    ticket.ticketStatus = "SELECTED";
    ticket.userId = this.authService.principalValue.id;
    this.socketClientService.send("/app/timetable/" + ticket.timetableId + "/ticket/update", ticket);

    this.selectedTicket = ticket
  }
}
