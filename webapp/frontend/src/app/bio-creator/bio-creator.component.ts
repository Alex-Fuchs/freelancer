import {Component} from '@angular/core';
import {DataService} from "../data.service";
import {Modal} from "bootstrap";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-bio-creator',
  templateUrl: './bio-creator.component.html',
  styleUrls: ['./bio-creator.component.css']
})
export class BioCreatorComponent {

  bioForm: FormGroup;

  hidden: boolean = false;
  hidden_success: boolean = false;

  title_error: string = '';
  message_error: string = '';

  title_success: string = '';
  message_success: string = '';

  constructor(private dataService: DataService, private formBuilder: FormBuilder,) {
  }

  ngOnInit(): void {
    this.bioForm = this.formBuilder.group({
      text: ['']
    });
  }

  upload() {
    this.hidden = true;

    if (this.bioForm.value.text.length < 75) {
      this.title_error = 'Not enough information'
      this.message_error = 'Your description lacks sufficient details to create an accurate bio. Please provide at' +
        ' least 25 words; otherwise, the generated bio may contain random or unrelated information about you.'

      const modal = new Modal(document.getElementById('modal_error') as HTMLElement);
      modal.show();

      this.hidden = false;
    } else {
      this.dataService.bio_creator(this.bioForm.value.text).subscribe(
        data => {
          this.title_success = 'Your created bio'
          this.message_success = data.response

          const modal = new Modal(document.getElementById('modal_success') as HTMLElement);
          modal.show();

          this.hidden = false;
        });
    }
  }

  upload_again() {
    this.hidden_success = true;

    this.dataService.bio_creator(this.bioForm.value.text).subscribe(
      data => {
        this.title_success = 'Your created bio'
        this.message_success = data.response

        this.hidden_success = false;
      });
  }
}
