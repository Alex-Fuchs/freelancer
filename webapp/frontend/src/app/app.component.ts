import {Component} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from "@angular/router";
import {DataService} from "./data.service";

/**
 * Initializes navbar and footer.
 *
 * @author Alexander Fuchs
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = "";

  constructor() { }
}
