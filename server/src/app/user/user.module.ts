import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserEditComponent } from './user-edit/user-edit.component';


@NgModule({
  declarations: [UserListComponent, UserCreateComponent, UserEditComponent],
  imports: [
    CommonModule,
    UserRoutingModule
  ],
  exports: [UserListComponent, UserCreateComponent, UserEditComponent]
})
export class UserModule { }
