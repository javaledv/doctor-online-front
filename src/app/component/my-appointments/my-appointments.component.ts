import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {merge, of as observableOf} from "rxjs";
import {catchError, map, startWith, switchMap} from "rxjs/operators";
import {TicketService} from "../../service/ticket/ticket.service";
import {AuthService} from "../../service";
import {TicketInfo} from "../../dto/ticket-info";
import {Ticket} from "../../dto/ticket";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {SocketClientService} from "../../client/socket-client.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.css']
})
export class MyAppointmentsComponent implements AfterViewInit, OnInit {

  data: TicketInfo [];
  displayedColumns: string[] = ['doctor', 'cabinet', 'date', 'time', 'status', 'action'];
  resultsLength = 0;
  pageSize = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  statusFilter = "";
  allStatuses = ["ALL", "RESERVED", "EXPIRED", "DONE"];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.socketClientService.onMessage("/user/topic/timetable/updated").subscribe(timetable => {
      for (const ticket of timetable.tickets) {
        if (ticket.id === timetable.updatedTicketId && ticket.ticketStatus === "OPENED") {
          this.updateTable();
          this.openSnackBar("Запись успешно отменена", "Запись к врачу");
        }
      }
    })
  }

  constructor(private ticketService: TicketService,
              private authService: AuthService,
              public dialog: MatDialog,
              private socketClientService: SocketClientService,
              private _snackBar: MatSnackBar,
              private router: Router,
              private route: ActivatedRoute) {
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
      horizontalPosition: "end",
      verticalPosition: "top",
      panelClass: ['snackbar']
    }).onAction().subscribe(() =>
      this.router.navigate(["appointments/create"], {relativeTo: this.route.parent})
    );
  }

  statusFilterChanged(status) {
    this.statusFilter = status;
    this.updateTable();
  }

  createSearchParams(): string {
    let result = '?';
    result = result + `patientId=${this.authService.principalValue.id}&status=${this.statusFilter == "ALL" ? '' : this.statusFilter}&`;
    return result;
  }

  updateTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.ticketService!.listSort(this.createSearchParams(), this.paginator.pageIndex,
            this.sort.active, this.sort.direction);
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.totalElements;
          this.pageSize = data.size;

          return data.content;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => {
      this.data = data;
      console.log(data)
    });
  }

  getColor(ticket: Ticket): string {
    if (ticket.ticketStatus === "RESERVED") {
      return "#e44642"
    }
    return "#cccdce6b";
  }

  openDialog(ticket: Ticket): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '250px',
      data: ticket
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm-dialog.html',
  styleUrls: ['./my-appointments.component.css']
})
export class ConfirmDialog {

  constructor(public dialogRef: MatDialogRef<ConfirmDialog>,
              @Inject(MAT_DIALOG_DATA) public data: Ticket,
              private socketClientService: SocketClientService,
              private authService: AuthService) {
  }

  close(): void {
    this.dialogRef.close();
  }

  discardAppointment(ticket: Ticket) {
    let toSend = {
      id: ticket.id,
      userId: this.authService.principalValue.id,
      ticketStatus: "OPENED",
      timetableId: ticket.timetableId
    };

    this.socketClientService.send("/app/timetable/" + ticket.timetableId + "/ticket/update", toSend);
    this.dialogRef.close();
  }
}
