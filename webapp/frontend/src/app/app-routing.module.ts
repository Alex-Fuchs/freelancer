import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HomeComponent} from "./home/home.component";
import {SigninComponent} from "./signin/signin.component"
import {AccountComponent} from "./account/account.component";
import {ReportComponent} from "./report/report.component";
import {InvoiceComponent} from "./invoice/invoice.component";
import {AuthGuard} from "./auth.guard";

const routes: Routes = [
  {path: '', canActivate: [AuthGuard], component: HomeComponent},
  {path: 'signIn', canActivate: [AuthGuard], component: SigninComponent},
  {path: 'account', canActivate: [AuthGuard], component: AccountComponent},
  {path: 'report', canActivate: [AuthGuard], component: ReportComponent},
  {path: 'invoice', canActivate: [AuthGuard], component: InvoiceComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
