import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormGroupDirective } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BooksService } from 'src/app/_shared/books.service';
import { IBook } from 'src/app/model/book.model';
import { NotificationService } from 'src/app/_shared/notification.service';
import { map } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_shared/authentication.service';

@Component({
  selector: 'book-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.css']
})
export class BookEditComponent implements OnInit , OnDestroy {


  book: IBook;
  bookSubscription: Subscription;
  bookEditSubscription: Subscription;

  bookEditForm: FormGroup;

  imageUrl: any;
  bookImageUploadSizeError = false;
  typeOfEdit: string;
  uploadedBookImageFile: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private bookService: BooksService,
              private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              private authService: AuthenticationService,
              private notificationService: NotificationService) {}

  ngOnInit(): void {


    this.bookEditForm = this.fb.group({
      name: [{
              value: '',
              disabled: false
          },
          [Validators.required]
      ],
      price: [{
              value: '',
              disabled: false
          },
          [Validators.required]
      ],
      imagePath: [{
              value: '',
              disabled: false
          },
          [Validators.required]
      ],
      bookCondition: [{
              value: '',
              disabled: false
          },
          [Validators.required]
      ],
      publication: [{
              value: '',
              disabled: false
          },
          [Validators.required]
      ],
      standard: [{
              value: '',
              disabled: false
          },
          [Validators.required]
      ],
      category: [{
          value: '',
          disabled: false
      }],
      author: [{
          value: '',
          disabled: false
      }],
      subject: [{
              value: '',
              disabled: false
          },
          [Validators.required]
      ],
      postedBy: [{
              value: '',
              disabled: true
          }],
      userImage: [{
        value: '',
        disabled: false
      }]
    });

    const success = (data) => {
      if ( data && data.resolvedData && data.resolvedData.books && data.resolvedData.books.length > 0) {
          this.book = data.resolvedData.books[0];
          this.imageUrl = this.book.imagePath;
          this.typeOfEdit = 'editBook';
          this.updateBookEditForm();
      }else if (data && data.resolvedData && data.resolvedData.book){
          this.book = data.resolvedData.book;
          this.typeOfEdit = 'addNewBook';
          this.updateBookEditForm();
      }
      
      if (data.resolvedData.error){
        throw new Error(data.resolvedData.error);
      }
    };

    const error = (errorData) => {
      throw new Error (errorData);
    };

    this.bookSubscription = this.route.data.subscribe(success, error);

  }

  updateBookEditForm(){
    this.bookEditForm.patchValue({
        name: this.book.name,
        price: this.book.price,
        imagePath: this.book.imagePath,
        bookCondition: this.book.bookCondition,
        publication: this.book.publication,
        standard: this.book.standard,
        category: this.book.category,
        author: this.book.author,
        subject: this.book.subject,
        postedBy: this.authService.currentUserValue.firstName
    });
  }

  uploadFile(event){
    const reader = new FileReader(); // HTML5 FileReader API
    const file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
        this.bookImageUploadSizeError = false;
        this.uploadedBookImageFile = null;

         // what your < 1000kb file will do
        if (file.size < 102400) {
            reader.readAsDataURL(file);
            this.uploadedBookImageFile = file;
        }else{
            reader.abort();
            this.bookImageUploadSizeError = true;
        }


      // When file uploads set it to file formcontrol
        reader.onload = () => {
          this.imageUrl = reader.result;
      };
      // ChangeDetectorRef since file is loading outside the zone
        this.cd.markForCheck();
    }
  }

  navigateTo(location: string){
    this.router.navigateByUrl('books');
  }

  ngOnDestroy(): void {
      if (this.bookSubscription ){
          this.bookSubscription.unsubscribe();
      }
      if (this.bookEditSubscription){
        this.bookEditSubscription.unsubscribe();
      }
  }

  onSubmit(booksEditDirective: FormGroupDirective) {
      // stop here if form is invalid
      if (this.bookEditForm.invalid && this.bookImageUploadSizeError) {
        return;
      }

      if (this.uploadedBookImageFile){
          this.bookEditForm.patchValue({
            userImage: this.uploadedBookImageFile,
            imagePath: ''
          });
      }

      const book = this.bookEditForm.value;


      const success = (data) => {
        // Clearing uploaded image file
        this.uploadedBookImageFile = null;
        if (data && data.message && !data.info){
          return this.notificationService.showSuccess(data.message);
        }
        if (data.info && data.info.nModified === 0){
          return this.notificationService.showError(data.message);
        }
        if (data.resolvedData.error){
          throw new Error(data.resolvedData.error);
        }
      };
      const error = (errorData) => {
        // Clearing uploaded image file
        this.uploadedBookImageFile = null;
        throw new Error (errorData);
      };


      if (this.typeOfEdit === 'editBook'){
        // tslint:disable-next-line: no-shadowed-variable
        const updatedBookData = Object.keys(book).filter((key) => {
            if (key !== 'addedBy' && key !== 'imagePath') {
                  if (key === 'userImage' && this.uploadedBookImageFile){
                      return key;
                  }else if (key !== 'userImage'){
                      return key;
                  }

            }
            }).map((key) => {
                    return {
                        propName: key,
                        value: book[key]
                    };
          });


        const bookId = this.book._id;
        this.bookEditSubscription = this.bookService.updateBook(updatedBookData, bookId).subscribe(success, error);
      }
      else if (this.typeOfEdit === 'createBook'){
        this.bookEditSubscription = this.bookService.createBook(book).subscribe(success, error);
      }


  }




}
