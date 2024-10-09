import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HomeComponent} from "./home/home.component";
import {ContactComponent} from "./contact/contact.component"
import {PhotoRaterComponent} from "./photo-rater/photo-rater.component";
import {FaceEnhancerComponent} from "./face-enhancer/face-enhancer.component";
import {BioCreatorComponent} from "./bio-creator/bio-creator.component";
import {MessageSuggestorComponent} from "./message-suggestor/message-suggestor.component";

const routes: Routes = [
  {path: 'photo_rater', component: PhotoRaterComponent},
  {path: 'face_enhancer', component: FaceEnhancerComponent},
  {path: 'bio_creator', component: BioCreatorComponent},
  {path: 'message_suggestor', component: MessageSuggestorComponent},
  {path: 'home', component: HomeComponent},
  {path: 'contact', component: ContactComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
