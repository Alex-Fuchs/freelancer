import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HomeComponent} from "./home/home.component";
import {ContactComponent} from "./contact/contact.component"
import {AuthGuard} from "./auth.guard";

const routes: Routes = [
  {path: '', canActivate: [AuthGuard], component: HomeComponent},
  {path: 'contact', canActivate: [AuthGuard], component: ContactComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
