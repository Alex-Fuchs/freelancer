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

  contactForm: FormGroup;

  hidden: boolean = false;

  constructor(private dataService: DataService, private formBuilder: FormBuilder, private router: Router) {
  }

  /**
   * Initializes all inputs for signing in.
   */
  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      prename: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      organization: [''],
      message: ['', [Validators.required]]
    });
  }

  /**
   * trys to sign in and if successful saves the token and forwards to /report
   */
  onSubmit(): void {
    this.hidden = true;

    this.dataService.contact(this.contactForm.value.prename, this.contactForm.value.surname, this.contactForm.value.email,
      this.contactForm.value.organization, this.contactForm.value.message).subscribe(data => {
        this.hidden = false;

        this.router.navigate(['']);
    })
  }
}
