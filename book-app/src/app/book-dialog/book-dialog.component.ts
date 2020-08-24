import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { BookDialogData } from '../model/book.model';

@Component({
  selector: 'book-book-dialog',
  templateUrl: './book-dialog.component.html',
  styleUrls: ['./book-dialog.component.css']
})
export class BookDialogComponent implements OnInit {

  bookDialogData: BookDialogData;

  constructor(@Inject(MAT_DIALOG_DATA) data: BookDialogData) {
    this.bookDialogData = data;
   }

  ngOnInit(): void {
  }


}
