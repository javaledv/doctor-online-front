import {Ticket} from "./ticket";

export class Timetable {
  id: number;
  doctorId: number;
  date: Date;
  tickets: Ticket [];

  startAppointmentTime: Date;
  finishAppointmentTime: Date;

  updatedTicketId: number;
}
