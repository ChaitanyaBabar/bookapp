/**
 * Copyright (c) 2025 Chaitanya Babar
 * Licensed under the MIT License. See LICENSE file in the project root for full license information. 
 */


import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angularApp';

  /**
   * Demo change in the app.component.ts file
   * to test the GitHub Actions workflow
   * for rasing a PR , containing the file that does not
   * have copy-right headers and hence Github Actions
   * for check-copyright.yml make the PR to fail.
   */
}


// Dummy unrelated change in server/src/app/app.components.ts | server-acl | Batch 1