import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "./_helper/auth.guard";
import {HomeComponent} from "./home";
import {LoginComponent} from "./login";
import {RegisterComponent} from "./register/register.component";
import {ActivateUserGuard} from "./_helper/activate-user.guard";
import {ActivateComponent} from "./activate/activate.component";

const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [AuthGuard, ActivateUserGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'activate', component: ActivateComponent, canActivate: [AuthGuard]},

  // otherwise redirect to home
  {path: '**', redirectTo: ''}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
