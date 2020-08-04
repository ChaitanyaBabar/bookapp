import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective } from '@angular/forms';
import { AuthenticationService } from '../_shared/authentication.service';
import { Subscription, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  public loginSubscription: Subscription;
  loginUrl: string;
  loginForm: FormGroup;
  userEmail: string;
  userPassword: string;
  hide: boolean;


  constructor(private authService: AuthenticationService ,
              private route: ActivatedRoute,
              private http: HttpClient,
              private router: Router) {

    this.loginUrl = 'login/v1/signin';
    this.hide = true;
  }

  get email() { return this.loginForm.get('email'); }

  get password() { return this.loginForm.get('password'); }

  ngOnInit() {

    this.loginForm = new FormGroup({
      'email': new FormControl(this.userEmail, [Validators.required, Validators.email]),
      'password': new FormControl(this.userPassword, [Validators.required]),
    });

    this.authService.logout();
  }


  onSubmit(loginDirective: FormGroupDirective): void {

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loginSubscription = this.authService.login(this.loginUrl, this.email.value , this.password.value).subscribe(data => {
                                    this.router.navigate(['/books/list']);
                            }, error => {
                              this.loginForm.reset();
                              loginDirective.resetForm();
                              throw new Error (error);
                            });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.loginSubscription.unsubscribe();
  }
}
