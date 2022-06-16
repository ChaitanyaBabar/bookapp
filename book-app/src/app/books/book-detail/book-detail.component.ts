import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from 'src/app/model/book.model';
import { Subscription } from 'rxjs';
import { UntypedFormGroup, Validators, UntypedFormBuilder, FormGroupDirective } from '@angular/forms';
import { NotificationService } from '../../_shared/notification.service';

@Component({
  selector: 'book-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit, OnDestroy {

  book: Book;
  bookSubscription: Subscription;
  bookDetailForm: UntypedFormGroup;
  imageUrl: any;


  showError =  false;
  errorMessage: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private fb: UntypedFormBuilder,
              private notificationService: NotificationService
              ) {}

  ngOnInit(): void {

    this.bookDetailForm = this.fb.group({
        name: [{
                value: '',
                disabled: true
            },
            [Validators.required]
        ],
        price: [{
                value: '',
                disabled: true
            },
            [Validators.required]
        ],
        imagePath: [{
                value: '',
                disabled: true
            },
            [Validators.required]
        ],
        bookCondition: [{
                value: '',
                disabled: true
            },
            [Validators.required]
        ],
        publication: [{
                value: '',
                disabled: true
            },
            [Validators.required]
        ],
        standard: [{
                value: '',
                disabled: true
            },
            [Validators.required]
        ],
        category: [{
            value: '',
            disabled: true
        }],
        author: [{
            value: '',
            disabled: true
        }],
        subject: [{
                value: '',
                disabled: true
            },
            [Validators.required]
        ],
        postedBy: [{
                value: '',
                disabled: true
            }
        ],
    });

    const success = (data) => {
        this.showError = false;
        this.errorMessage = '';

        if (data && data.resolvedData && data.resolvedData.books && data.resolvedData.books.length > 0) {
          this.book = data.resolvedData.books[0];
          this.imageUrl = this.book.imagePath;
          this.updateBookDetailForm();
      }
        if (data.resolvedData && data.resolvedData.error){
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



  updateBookDetailForm(){
    this.bookDetailForm.patchValue({
        name: this.book.name,
        price: this.book.price,
        imagePath: this.book.imagePath,
        bookCondition: this.book.bookCondition,
        publication: this.book.publication,
        standard: this.book.standard,
        category: this.book.category,
        author: this.book.author,
        subject: this.book.subject,
        postedBy: this.book.addedBy.firstName
    });
  }


  navigateTo(location: string){
    if (location === 'edit'){
        this.router.navigateByUrl('books/' + this.book._id + '/edit' );
    }else if (location === 'list'){
        this.router.navigateByUrl('books');
    }
  }

  ngOnDestroy(): void {
      if (this.bookSubscription ){
          this.bookSubscription.unsubscribe();
      }
  }

  onSubmit(booksDetailDirective: FormGroupDirective) {
  }




}
