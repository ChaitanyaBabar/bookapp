/**
 * Copyright (c) 2025 Chaitanya Babar
 * Licensed under the MIT License. See LICENSE file in the project root for full license information. 
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {

 /**
   * Demo change in the app.module.ts file
   * to test the GitHub Actions workflow
   * for rasing a PR , containing the file that does not
   * have copy-right headers and hence Github Actions
   * for check-copyright.yml make the PR to fail.
   */


 }
