import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { BookListComponent } from './book-list/book-list.component';
import { AuthGuard } from '../_helpers/auth.guard';


const routes: Routes = [
  { path: 'books/list', component:  BookListComponent , canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookRoutingModule { }
