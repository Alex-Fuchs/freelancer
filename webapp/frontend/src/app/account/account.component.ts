import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {DataService} from "../data.service";
import {Modal} from 'bootstrap';

const passwordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  let password = control.get('newPassword');
  let passwordRepeat = control.get('newPasswordRepeat');

  return password && passwordRepeat && password.value !== passwordRepeat.value ? {noIdentity: true} : null;
};

const atLeastOneValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  let email = control.get('newEmail');
  let password = control.get('newPassword');

  return email && password && email.value === '' && password.value === '' ? {noChange: true} : null;
};

/**
 * Initializes account form with all modals.
 *
 * @author Alexander Fuchs
 */
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  response = {
    success: false,
    errors: {
      passwordWrong: false
    }
  };

  changeForm: FormGroup;

  constructor(private data: DataService, private formBuilder: FormBuilder, private router: Router) {
  }

  /**
   * Initializes all inputs for changing the account information.
   */
  ngOnInit(): void {
    this.changeForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newEmail: ['', [Validators.email]],
      newPassword: ['', [Validators.minLength(5), Validators.maxLength(30)]],
      newPasswordRepeat: ['']
    }, {validators: [passwordValidator, atLeastOneValidator]});
  }

  /**
   * Trys to change the account information and shows if successful. Reads all inputs. Only changes values !== ''.
   */
  onSubmit(): void {
    this.data.change(this.changeForm.value.oldPassword, this.changeForm.value.newEmail, this.changeForm.value.newPassword).subscribe(data => {
      this.response = data;

      if (this.response.success) {
        let element = document.getElementById('status') as HTMLElement;
        let modal = new Modal(element);

        modal.show();
      }
    });
  }
}
