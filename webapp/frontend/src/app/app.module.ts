import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {SigninComponent} from './signin/signin.component';
import {AccountComponent} from './account/account.component';
import {ReportComponent} from './report/report.component';
import {InvoiceComponent} from './invoice/invoice.component';

import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";

import {DataService} from "./data.service";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SigninComponent,
    AccountComponent,
    ReportComponent,
    InvoiceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
