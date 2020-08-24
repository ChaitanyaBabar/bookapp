import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book, IBook } from '../model/book.model';
import { Observable } from 'rxjs';
import { EnvironmentUrlService } from './environment-url.service';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  baseUrl: string;

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) {
      this.baseUrl = this.envUrl.environmentUrl;
   }

  getAllBooks(): Observable<any>{
    const url = this.baseUrl + '/books/v1/book/all/list';
    return this.http.get<any>(url);
  }

  createBook(book: IBook): Observable<any>{
    const url = this.baseUrl + '/books/v1/single';
    return this.http.post<any>(url, book);
  }

  getBook(bookId: string){
    const url = this.baseUrl + `/books/v1/book/${bookId}`;
    return this.http.get<any>(url);
  }

  updateBook(book, bookId): Observable<any>{
    const url = this.baseUrl + `/books/v1/book/${bookId}`;
    return this.http.patch<any>(url, book);
  }

  deleteBook(bookId: string): Observable<any>{
    const url = this.baseUrl + `/books/v1/book/${bookId}`;
    return this.http.delete<any>(url);
  }

  getBooksOfCurrentUser(): Observable<any>{
    const url = this.baseUrl + '/books/v1/book/list';
    return this.http.get<any>(url);
  }


  // Admin Urls
  getBookListForAllUsers(){
    const url = this.baseUrl + '/books/v1/list';
    return this.http.get<any>(url);
  }

  getBookListForSpecificUser(userId: string){
    const url = this.baseUrl + `/books/v1/book/${userId}/book/list`;
    return this.http.get<any>(url);
  }

  getBookForSpecificUser(userId: string, bookId: string){
    const url = this.baseUrl + `/books/v1/user/${userId}/book/${bookId}`;
    return this.http.get<any>(url);
  }

  updateBookForSpecificUser(book: Book, userId: string){
    const bookId = book._id;
    const url = this.baseUrl + `/books/v1/user/${userId}/book/${bookId}`;
    return this.http.patch<any>(url, book);
  }

  deleteBookForSpecificUser(userId: string, bookId: string){
    const url = this.baseUrl + `/books/v1/user/${userId}/book/${bookId}`;
    return this.http.delete<any>(url);
  }
}
