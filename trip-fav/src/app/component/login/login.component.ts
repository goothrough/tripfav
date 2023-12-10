import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { messages } from 'src/app/constants/constants';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  formGroup: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });

  isPasswordHidden: boolean = true;

  hasLoginFailed: boolean = false;

  loginFailureMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {

  }

  getErrorMessage() {
    let errorMessages = {
      emailError: '',
      passwordError: ''
    };

    if (this.formGroup.controls['email'].hasError('required')) {
      errorMessages.emailError = 'You must enter a value';
    }

    if (this.formGroup.controls['password'].hasError('required')) {
      errorMessages.passwordError = 'You must enter a value';
    }

    if (this.formGroup.controls['email'].hasError('email')) {
      errorMessages.emailError = 'Not a valid email';
    }

    if (this.formGroup.controls['password'].hasError('minlength')) {
      errorMessages.passwordError = 'Password should be at least 6 characters';
    }

    return errorMessages;
  }

  login() {
    console.log('loginclicked')
    const { email, password } = this.formGroup.value;
    this.authService.login(email, password)
      .then(() => {
        this.hasLoginFailed = true;
        this.router.navigateByUrl('/home');
      })
      .catch((error) => {
        this.hasLoginFailed = true;
        if (error.code == 'auth/user-not-found') {
          this.loginFailureMessage = messages.NO_USER;
          return;
        }

        if (error.code = 'auth/wrong-password') {
          this.loginFailureMessage = messages.WRONG_PASSWORD;
          return;
        }

        this.loginFailureMessage = messages.EXCEPTION;
      });
    }
}
