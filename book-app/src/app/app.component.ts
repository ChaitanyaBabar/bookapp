import { Component } from '@angular/core';
import { UsersService } from './_shared/users.service';
import { Router } from '@angular/router';
import { slideInAnimation } from './app.animations';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  animations: [slideInAnimation]
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
