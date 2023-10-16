import {Component, OnInit} from '@angular/core';
import {DataService} from "../data.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {set} from "lodash";
import {Modal} from "bootstrap";

/**
 * Initializes report overview with all modals.
 *
 * @author Alexander Fuchs
 */
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  Object = Object;

  jobs = {
    loaded: false,
    columns: ['Order ID', 'Job ID', 'Feld ID', 'Feld Name', 'Datum'],
    data: [],
  };

  configurations = [
    {title: 'Allgemein', inputs: []},
    {title: 'Überblick', inputs: [{key: 'overview:general_info', type: 'checkbox'}]},
    {title: 'Unkräuter', inputs: [{key: 'overview:weed_types', type: 'checkbox'}]},
    {title: 'Erfolg', inputs: [{key: 'overview:status_overview', type: 'checkbox'}]},
    {title: 'Unkraut Typ', inputs: []},
    {title: 'Überblick', inputs: [{key: 'weed_type:general_info', type: 'checkbox'}]},
    {title: 'Erfolg', inputs: [{key: 'weed_type:status_overview', type: 'checkbox'}]},
    {title: 'Auffälligkeiten', inputs: [{key: 'weed_type:insights', type: 'checkbox'}]},
    {title: 'Extraktionsdaten', inputs: [{key: 'weed_type:extractions_list', type: 'checkbox'}]},
    {
      title: 'Extraktionsbilder',
      inputs: [{key: 'weed_type:images_list:value', type: 'checkbox'}, {
        title: 'Anzahl',
        key: 'weed_type:images_list:number',
        type: 'text'
      }]
    },
    {title: 'Roboter', inputs: []},
    {title: 'Überblick', inputs: [{key: 'robots_overview:robot_list', type: 'checkbox'}]},
    {title: 'Auffälligkeiten', inputs: [{key: 'robots_overview:insights', type: 'checkbox'}]}
  ]

  response = {
    success: false
  };

  jobsForm: FormGroup;
  configurationsForm: FormGroup;

  constructor(private data: DataService, private formBuilder: FormBuilder) {
  }

  /**
   * Initializes all the inputs for selecting which jobs and which configurations.
   */
  ngOnInit() {
    this.jobsForm = this.formBuilder.group({});
    this.configurationsForm = this.formBuilder.group({});

    this.data.getJobs().subscribe(data => {
      this.jobs = data;

      for (let job of this.jobs.data) {
        this.jobsForm.addControl(job[0], new FormControl(false));
      }

      for (let line of this.configurations) {
        for (let input of line['inputs']) {
          if (input['type'] === 'checkbox') {
            this.configurationsForm.addControl(input['key'], new FormControl(true));
          } else {
            this.configurationsForm.addControl(input['key'], new FormControl('', Validators.pattern('[0-9]*')));
          }
        }
      }
    });
  }

  /**
   * Disables number input if checkbox is set to false.
   *
   * @param key key of the checkbox
   */
  onChange(key: string): void {
    if (key === 'weed_type:images_list:value') {
      let control = this.configurationsForm.get('weed_type:images_list:number');

      if (control.disabled) {
        control.enable();
      } else {
        control.setValue('');
        control.disable();
      }
    }
  }

  /**
   * Trys to send the reports and shows if successful. Reads all the values from the inputs.
   */
  onSubmit(): void {
    let ids = [];

    for (let field in this.jobsForm.controls) {
      if (this.jobsForm.get(field).value) {
        ids.push(field);
      }
    }

    let configurations = {};

    for (let field in this.configurationsForm.controls) {
      if (this.configurationsForm.get(field).value !== '') {
        set(configurations, field.replaceAll(':', '.'), this.configurationsForm.get(field).value);
      }
    }

    this.data.sendReports(ids, configurations).subscribe(data => {
      this.response = data;

      let status = document.getElementById('status') as HTMLElement;
      new Modal(status).show();
    });
  }
}
