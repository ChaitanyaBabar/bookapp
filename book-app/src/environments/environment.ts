// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAyuPGsVAaUSNlqSHwcQXZnEHLeBkOaOqo',
    authDomain: 'my-books-project-007.firebaseapp.com',
    databaseURL: 'https://my-books-project-007.firebaseio.com',
    projectId: 'my-books-project-007',
    storageBucket: 'my-books-project-007.appspot.com',
    messagingSenderId: '249538888517',
    appId: '1:249538888517:web:de51d2d8f8cbdf7817742c',
    measurementId: 'G-2JZC8F8YJM'
  },
  baseUrl: 'http://localhost:3001'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
