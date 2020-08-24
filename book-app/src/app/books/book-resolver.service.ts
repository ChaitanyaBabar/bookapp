import { Injectable, resolveForwardRef } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BookResolved, createBook } from '../model/book.model';
import { Observable, of } from 'rxjs';
import { BooksService } from '../_shared/books.service';

@Injectable({
  providedIn: 'root'
})
export class BookResolverService implements Resolve<BookResolved>{


  constructor(private booksService: BooksService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const bookID = route.paramMap.get('id');
    // Create a Blank book.
    if ( bookID == '0'){
      return of({book: new createBook()});
    }
    // If book is is not a string.
    if (!isNaN(+bookID)){
      return of({book: null, error: `Provided book id ${bookID} is not a string`});
    }

    if ( bookID && bookID !== '0'){
      return this.booksService.getBook(bookID);
   }
  }


}
