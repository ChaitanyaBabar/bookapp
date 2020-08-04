import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonAngularMaterialModule } from '../common-angular-material/common-angular-material.module';



import { BookListComponent } from './book-list/book-list.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { BookAddComponent } from './book-add/book-add.component';
import { BookRoutingModule } from './book-routing.module';


@NgModule({
  declarations: [BookListComponent, BookDetailComponent, BookAddComponent],
  imports: [
    CommonModule,
    CommonAngularMaterialModule,
    BookRoutingModule,
  ],
  exports: [BookListComponent, BookDetailComponent, BookAddComponent]
})
export class BookModule { }
