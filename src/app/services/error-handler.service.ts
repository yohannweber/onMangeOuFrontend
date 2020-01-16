import { Injectable, ErrorHandler } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {

  private _errors: any[] = [];

  handleError(error) {
    if (error.error instanceof ErrorEvent) {
      // client-side error
      this._errors.push( `Error: ${error.error.message}`);
    } else {
      // server-side error
      this._errors.push( `Error Code: ${error.status} Message: ${error.message}`);
    }
  }

  get error() : any[]{
    return this._errors;
  }

  public hasErrors() : boolean {
    return this._errors.length > 0;
  }

  public clearErrors(){
    this._errors = [];
  }

  constructor() { }
}
