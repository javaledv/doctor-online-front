import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {BasicAuthInterceptor} from "./_helper";
import {UnauthorizedInterceptor} from "./_helper/unauthorized.interceptor";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppRoutingModule} from './app-routing.module';
import {LoginComponent} from "./login";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AngularMaterialModule} from "./angular-material.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {DashboardComponent, ProfileDialog} from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import { DistrictDoctorComponent } from './district-doctor/district-doctor.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    RegisterComponent,
    ProfileDialog,
    DistrictDoctorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    AngularMaterialModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: UnauthorizedInterceptor, multi: true},
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
