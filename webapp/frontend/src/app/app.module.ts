import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";

import {HomeComponent} from './home/home.component';
import {ContactComponent} from './contact/contact.component';
import {MessageSuggestorComponent} from './message-suggestor/message-suggestor.component';
import {BioCreatorComponent} from './bio-creator/bio-creator.component';
import {PhotoRaterComponent} from './photo-rater/photo-rater.component';
import {FaceEnhancerComponent} from './face-enhancer/face-enhancer.component';

import {DataService} from "./data.service";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContactComponent,
    MessageSuggestorComponent,
    BioCreatorComponent,
    PhotoRaterComponent,
    FaceEnhancerComponent,
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
