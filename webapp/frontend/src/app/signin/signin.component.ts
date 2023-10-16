import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StorageService} from "../storage.service";
import {Router} from "@angular/router";
import {DataService} from "../data.service";

/**
 * Initializes signIn form.
 *
 * @author Alexander Fuchs
 */
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  response = {
    success: false,
    token: '',
    errors: {
      usernameNotPresent: false,
      passwordWrong: false
    }
  };

  signInForm: FormGroup;

  constructor(private data: DataService, private storage: StorageService, private formBuilder: FormBuilder, private router: Router) {
  }

  /**
   * Initializes all inputs for signing in.
   */
  ngOnInit(): void {
    this.signInForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  /**
   * trys to sign in and if successful saves the token and forwards to /report
   */
  onSubmit(): void {
    this.data.signIn(this.signInForm.value.username, this.signInForm.value.password).subscribe(data => {
      this.response = data;

      if (this.response.success) {
        this.storage.saveToken(this.response.token);

        this.router.navigate(['/report']);
      }
    });
  }
}
