
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'

})
export class CommonService {
  token: any;
  headersObj: any;
  options: any;
  constructor(
    private _http: HttpClient
  ) {
  }


  getHeader() {
    this.token = localStorage.getItem("token");
    //this.headersObj = new HttpHeaders().set("Content-Type", "application/json; charset=utf-8").set("Authorization", 'Bearer ' + this.token);
    this.headersObj = new HttpHeaders()
      .set("Content-Type", "application/json; charset=utf-8")
      .set('Accept', 'application/json')
      .set('Access-Control-Allow-Origin', "*")
      .set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT')
    //  .set("x-access-token", this.token);
    let header = {
      headers: this.headersObj
    }
    return header;
  }

  getFileHeader() {
    // this.token = localStorage.getItem("token") || '';
    this.headersObj = new HttpHeaders();
      //.set("Content-Type", "multipart/form-data")
      // .set("x-access-token", this.token);
    let header = {
      headers: this.headersObj
    }
    return header;
  }

  getNotokenHeader() {
    this.headersObj = new HttpHeaders()
      .set("Content-Type", "application/json; charset=utf-8")
      .set('Accept', 'application/json')
      .set('Access-Control-Allow-Origin', "*")
      .set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    return this.headersObj;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned error,body was:`
      )
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
  post(url, data): Observable<any> {
    return this._http.post(
      environment.API_ENDPOINT + url, data, this.getHeader()
    )
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }

  noTokenPost(url, data): Observable<any> {

    return this._http.post(
      environment.API_ENDPOINT + url, data, this.getNotokenHeader()
    )
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }

  documentUpload(data, URL): Observable<any> {
    return this._http.post(
      environment.API_ENDPOINT + URL, data
    )
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }
  put(url, data): Observable<any> {
    return this._http.put(
      environment.API_ENDPOINT + url, data, this.getHeader()
    )
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }
  photoUpload(url, data): Observable<any> {
    return this._http.post(
      environment.API_ENDPOINT + url, data, this.getFileHeader()
    )
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }
  noTokenGet(url): Observable<any> {
    return this._http.get(
      environment.API_ENDPOINT + url, this.getNotokenHeader()
    ).pipe(
      catchError(this.handleError) // then handle the error
    );
  }

  get(url): Observable<any> {
    return this._http.get(
      environment.API_ENDPOINT + url, this.getHeader()
    ).pipe(
      catchError(this.handleError) // then handle the error
    );
  }
  delete(url): Observable<any> {
    return this._http.delete(
      environment.API_ENDPOINT + url, this.getHeader()
    )
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }
}
