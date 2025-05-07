/**
 * Copyright (c) 2025 Chaitanya Babar
 * Licensed under the MIT License. See LICENSE file in the project root for full license information. 
 */
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
export class UserModule { 

 /**
   * Demo change in the app.module.ts file
   * to test the GitHub Actions workflow
   * for rasing a PR , containing the file that does not
   * have copy-right headers and hence Github Actions
   * for check-copyright.yml make the PR to fail.
   * 
   * Should not raise a copyright PR, for this change.
   * 
   * This file should be excluded from the check-copyright.yml as it already has
   * copyright header.
   */

}
