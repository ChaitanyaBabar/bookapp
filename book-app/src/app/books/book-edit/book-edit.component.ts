import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Validators, UntypedFormGroup, UntypedFormBuilder, FormGroupDirective } from '@angular/forms';
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

  bookEditForm: UntypedFormGroup;
  bookEditFormData: FormData;

  imageUrl: any;
  bookImageUploadSizeError = false;
  typeOfEdit: string;
  uploadedBookImageFile: any;

  showError =  false;
  errorMessage: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private bookService: BooksService,
              private fb: UntypedFormBuilder,
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
      this.showError = false;
      this.errorMessage = '';
      if ( data && data.resolvedData && data.resolvedData.books && data.resolvedData.books.length > 0) {
          this.book = data.resolvedData.books[0];
          this.imageUrl = this.book.imagePath;
          this.typeOfEdit = 'editBook';
          this.bookEditForm.reset();
          this.updateBookEditForm();
      }else if (data && data.resolvedData && data.resolvedData.book){
          this.book = data.resolvedData.book;
          this.typeOfEdit = 'addNewBook';
          this.bookEditForm.reset();
          this.updateBookEditForm();
      }

      if (data.resolvedData && data.resolvedData.error){
        this.bookEditForm.reset();
        this.showError = true;
        this.errorMessage = data.resolvedData.error;
        this.notificationService.showError(this.errorMessage);
      }
    // throw new Error(data.resolvedData.error);

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

   // TODO: Kept the isFromInvalid function to know the invalid Form Logic (code is present in form of conditions in html template)
  isFormInvalid(){
    if ((this.bookEditForm.valid &&
        this.bookEditForm.dirty) ||
        (!this.bookImageUploadSizeError &&
        this.uploadedBookImageFile)){
        return false;
    }
    return true;
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
      this.bookEditFormData = new FormData();
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

        if (data && data.message && !data.infoMessage){
              if (this.typeOfEdit === 'addNewBook'){
                  this.bookEditForm.reset();
                  this.router.navigateByUrl('books');
              }
              else if (this.typeOfEdit === 'editBook'){
                const newUpdatedDoc = data.updatedBook;
                // TODO: Decide whether to reset form or not.
                this.bookEditForm.reset();
                this.book = newUpdatedDoc;
                this.updateBookEditForm();
              }
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
        // Clearing uploaded image file and resetting form
        this.uploadedBookImageFile = null;

        throw errorData;
      };


      if (this.typeOfEdit === 'editBook'){
        // tslint:disable-next-line: no-shadowed-variable
        let updatedBookData;
        Object.keys(book).filter((key) => {
            if (key !== 'addedBy' && key !== 'imagePath') {
                  if (key === 'userImage' && this.uploadedBookImageFile){
                      return key;
                  }else if (key !== 'userImage'){
                      return key;
                  }

            }
            }).map((key) => {
              this.bookEditFormData.append(key, this.bookEditForm.get(key).value);
          });

        updatedBookData = this.bookEditFormData;
        const bookId = this.book._id;
        this.bookEditSubscription = this.bookService.updateBook(updatedBookData, bookId).subscribe(success, error);
      }
      else if (this.typeOfEdit === 'addNewBook'){
        let createBookData;
        Object.keys(book).filter((key) => {
          if (key !== 'addedBy' && key !== 'imagePath') {
              if (key === 'userImage' && this.uploadedBookImageFile) {
                  return key;
              } else if (key !== 'userImage') {
                  return key;
              }
          }})
          .map((key) => {
              this.bookEditFormData.append(key, this.bookEditForm.get(key).value);
          });
        createBookData = this.bookEditFormData;
        this.bookEditSubscription = this.bookService.createBook(createBookData).subscribe(success, error);
      }
  }



}
