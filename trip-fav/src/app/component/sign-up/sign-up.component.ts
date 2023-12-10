import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';
import { messages } from 'src/app/constants/constants';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as firebase from 'firebase/auth';
import { Observable } from 'rxjs';
import { TripService } from 'src/app/service/trip/trip.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  formGroup: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });

  isPasswordHidden: boolean = true;
  hasSignUpFailed: boolean = false;
  signUpFailureMessage: string = '';

  user: Observable<firebase.User>;

  constructor(private authService: AuthService, private router: Router,
    private afAuth: AngularFireAuth) {

  }
  ngOnInit(): void {
    this.user = this.afAuth.authState;
  }

  getErrorMessage() {
    let errorMessages = {
      emailError: '',
      passwordError: ''
    };

    if (this.formGroup.controls['email'].hasError('required')) {
      errorMessages.emailError = messages.REQUIRED;
    }

    if (this.formGroup.controls['password'].hasError('required')) {
      errorMessages.passwordError = messages.REQUIRED;
    }

    if (this.formGroup.controls['email'].hasError('email')) {
      errorMessages.emailError = messages.INVALID_EMAIL;
    }

    if (this.formGroup.controls['password'].hasError('minlength')) {
      errorMessages.passwordError = messages.INVALID_PASSWORD_LENGTH;
    }

    return errorMessages;
  }

  signUp() {
    const { email, password } = this.formGroup.value;
    this.authService.createUser(email, password)
      .then(() => {
        this.hasSignUpFailed = false;
        this.router.navigateByUrl('/top');
      })
      .catch((error) => {
        this.hasSignUpFailed = true;
        if (error.code == 'auth/email-already-in-use') {
          this.signUpFailureMessage = messages.EMAIL_ALREADY_USED;
        } else {
          this.signUpFailureMessage = messages.EXCEPTION;
        }
      });
  }
}
