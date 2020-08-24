import { Component } from '@angular/core';
import { UsersService } from './_shared/users.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(private userService: UsersService,
              private router: Router) {
    this.initializeApp();
  }

  initializeApp() {
  }

  logout(){
    this.userService.logout();
    this.router.navigate([`login`]);
  }
}
