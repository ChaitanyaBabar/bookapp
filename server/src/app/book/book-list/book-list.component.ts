import { BooksService } from '../../_shared/books.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IBook } from 'src/app/modals/interfaces';
import { Subscription } from 'rxjs';




@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit, OnDestroy {

  public bookList: IBook[];
  public bookListSubscription: Subscription;
  public bookListUrl: string;
  public noRecordFound: boolean;

  public loginSubscription: Subscription;

  // tslint:disable-next-line: variable-name
  constructor(private _bookService: BooksService) {
    this.bookListUrl = 'books/v1/book/all/list';
    this.noRecordFound = false;
  }

  ngOnInit() {
    this.bookListSubscription = this._bookService.getBooks(this.bookListUrl).subscribe(data => {
        if( data && data.books ) {
            this.bookList = data.books.map((item) => {
              return {
                      _id: item._id,
                      name: item.name,
                      imagePath: item.imagePath,
                      addedBy: {
                            _id: item.addedBy._id,
                            name: item.addedBy.firstName,
                            email: item.addedBy.email
                      },
                      price: item.price,
                      author: item.author,
                      subject: item.subject,
                      bookCondition: item.bookCondition,
                      publication: item.publication,
                      standard: item.standard,
                      category: item.category,
                     };
            });
        }
        else if( data.message === "No records Found" ) {
          this.noRecordFound = true;
        }

    });
  }


  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.bookListSubscription.unsubscribe();
  }
}
