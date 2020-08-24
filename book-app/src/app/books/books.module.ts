import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';




import { FlexLayoutModule } from '@angular/flex-layout';

// Books Components
import { BooksListComponent } from './books-list/books-list.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { BookEditComponent } from './book-edit/book-edit.component';
import { AuthGuard } from '../_helpers/auth.guard';
import { MaterialModule } from '../material/material.module';
import { BookResolverService } from '../books/book-resolver.service';



const routes: Routes = [
  {
      path: 'books',
      component: BooksListComponent,
      canActivate: [AuthGuard]
  },
  {
      path: 'books/:id',
      component: BookDetailComponent,
      canActivate: [AuthGuard],
      resolve: { resolvedData: BookResolverService }
  },
  {
      path: 'books/:id/edit',
      component: BookEditComponent,
      canActivate: [AuthGuard],
      resolve: { resolvedData: BookResolverService }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ BooksListComponent,
                  BookDetailComponent,
                  BookEditComponent
                ]
})
export class BooksModule { }
