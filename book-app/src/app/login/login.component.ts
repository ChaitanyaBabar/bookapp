import { Component, OnInit, OnDestroy, ErrorHandler } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormGroupDirective } from '@angular/forms';
import { UsersService } from '../_shared/users.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_shared/authentication.service';

@Component({
  selector: 'book-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  loginSubscription: Subscription;

  constructor(private fb: FormBuilder,
              private userService: UsersService,
              private router: Router,
              private authenticationService: AuthenticationService) {
  }


  get email() { return this.loginForm.get('email').value; }

  get password() { return this.loginForm.get('password').value; }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, Validators.required]
    });
  }

  onSubmit(loginFormDirective: FormGroupDirective) {

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }


    const success = (user) => {
      if (user){
        const url = this.authenticationService.redirectUrl ? this.authenticationService.redirectUrl : 'welcome';
        this.authenticationService.redirectUrl = undefined;
        this.router.navigate([`/${url}`]);
      }
     };

    const error = (errorData) => {
      this.loginForm.reset();
      loginFormDirective.resetForm();
      throw new Error (errorData);
    };


    const email = this.email;
    const password = this.password;
    this.loginSubscription = this.userService.login(email, password).subscribe(success, error);
  }

  ngOnDestroy(): void {
    if(this.loginSubscription){
      this.loginSubscription.unsubscribe();
    }

  }

}
