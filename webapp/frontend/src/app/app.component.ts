import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from "@angular/router";
import {StorageService} from "./storage.service";
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
export class AppComponent implements OnInit {

  title: string = 'Kundenportal';

  signedIn: boolean;
  path: string;

  constructor(private data: DataService, private storage: StorageService, private location: Location, private router: Router) {
  }

  /**
   * Subscribes to reload event to adjust the buttons in the navbar.
   */
  ngOnInit() {
    this.router.events.subscribe(val => {
      this.signedIn = this.storage.isToken();
      this.path = this.location.path();
    });
  }

  /**
   * Clears the storage for token deleting and navigates to signIn.
   */
  public signOut() {
    this.storage.clear();

    this.router.navigate(['/signIn'])
  }
}
