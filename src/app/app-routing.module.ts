import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "./security/auth.guard";
import {LoginComponent} from "./component/login";
import {RegisterComponent} from "./component/register/register.component";
import {DashboardComponent} from "./component/dashboard/dashboard.component";
import {AppointmentWithDoctorComponent} from "./component/appointment-with-doctor/appointment-with-doctor.component";
import {MyAppointmentsComponent} from "./component/my-appointments/my-appointments.component";
import {PaidOperationsComponent} from "./component/paid-operations/paid-operations.component";
import {CardComponent} from "./component/card/card.component";

const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], children: [
      {path: 'appointments/create', component: AppointmentWithDoctorComponent, canActivate: [AuthGuard]},
      {path: 'appointments/my', component: MyAppointmentsComponent, canActivate: [AuthGuard]},
      {path: 'paid-operations', component: PaidOperationsComponent, canActivate: [AuthGuard]},
      {path: 'card', component: CardComponent, canActivate: [AuthGuard]},
    ]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},

  // otherwise redirect to home
  {path: '**', redirectTo: 'dashboard'}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
