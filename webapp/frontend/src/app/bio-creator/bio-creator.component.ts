import { Component } from '@angular/core';
import {DataService} from "../data.service";
import {Modal} from "bootstrap";

@Component({
  selector: 'app-bio-creator',
  templateUrl: './bio-creator.component.html',
  styleUrls: ['./bio-creator.component.css']
})
export class BioCreatorComponent {

  text: string = '';

  hidden: boolean = false;

  title: string = '';
  message: string = '';

  constructor(private dataService: DataService) { }

  upload() {
    this.hidden = true;

    this.dataService.bio_creator(this.text).subscribe(
      data => {
        console.log(data)

        this.message = data.response

        const modal = new Modal(document.getElementById('modal') as HTMLElement);
        modal.show();

        this.hidden = false;
    });
  }
}
