import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';




import { FlexLayoutModule } from '@angular/flex-layout';

// Books Components
import { BooksListComponent } from './books-list/books-list.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { BookEditComponent } from './book-edit/book-edit.component';



const routes: Routes = [
  {
      path: 'books',
      component: BooksListComponent
  },
  {
      path: 'books/:id',
      component: BookDetailComponent
  },
  {
      path: 'books/:id/edit',
      component: BookEditComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ BooksListComponent,
                  BookDetailComponent,
                  BookEditComponent
                ]
})
export class BooksModule { }
