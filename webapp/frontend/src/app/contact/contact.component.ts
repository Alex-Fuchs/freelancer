import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from "@angular/router";
import {DataService} from "../data.service";

/**
 * Initializes signIn form.
 *
 * @author Alexander Fuchs
 */
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  response = {
    success: false,
    token: '',
    errors: {
      usernameNotPresent: false,
      passwordWrong: false
    }
  };

  contactForm: FormGroup;

  constructor(private data: DataService, private formBuilder: FormBuilder, private router: Router) {
  }

  /**
   * Initializes all inputs for signing in.
   */
  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  /**
   * trys to sign in and if successful saves the token and forwards to /report
   */
  onSubmit(): void {

  }
}
