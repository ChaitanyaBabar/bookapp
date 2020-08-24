import { Component, OnInit, OnDestroy } from '@angular/core';
import { BooksService } from '../../_shared/books.service';
import { Book } from '../../model/book.model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'book-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.css']
})
export class BooksListComponent implements OnInit , OnDestroy{

  bookList: Book[] = [];
  noRecordFound: boolean;
  bookListSubscription: Subscription;

  constructor(private bookService: BooksService) { }

  ngOnInit(): void {

    const success = (response) => {
      if( response && response.books ) {
        this.bookList = response.books;
      }
      else if(response.message === "No records Found"){
        this.noRecordFound = true;
      }
    };

    const error = (errorData) => {
      throw new Error (errorData);
    };

    this.bookListSubscription = this.bookService.getAllBooks().subscribe(success, error);

  }

  ngOnDestroy(): void {
    this.bookListSubscription.unsubscribe();
  }

}
