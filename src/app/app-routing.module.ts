import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "./_helper/auth.guard";
import {LoginComponent} from "./login";
import {RegisterComponent} from "./register/register.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {DistrictDoctorComponent} from "./district-doctor/district-doctor.component";

const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], children: [
      {path: 'district', component: DistrictDoctorComponent, canActivate: [AuthGuard]},
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
