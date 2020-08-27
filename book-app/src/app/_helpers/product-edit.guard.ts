import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { BookEditComponent } from '../books/book-edit/book-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { BookDialogComponent } from '../book-dialog/book-dialog.component';
import { BookDialogData } from '../model/book.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductEditGuard  implements CanDeactivate<BookEditComponent> {

  constructor(public dialog: MatDialog){
  }


  canDeactivate(
    component: BookEditComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    if (component.bookEditForm.dirty) {

      const productName = component.book.name || 'New Book';

      const data: BookDialogData = {
        title: 'Save Changes',
        content: `You have unsaved changes to "${productName}" book. \n If you leave, your changes will be lost.`,
        primaryButtonLabel: 'Ok',
        secondaryButtonLabel: 'Cancel'
      };

      const dialogRef = this.dialog.open(BookDialogComponent, {data});

      return dialogRef.afterClosed().pipe(map(result => {
          if (result === data.primaryButtonLabel){
              return true;
          }
          if (result === data.secondaryButtonLabel){
            return false;
        }
      }));

    }
    return true;
  }
}
