import { Injectable } from '@angular/core';

export interface message{
  header: string,
  details: string
}

@Injectable({
  providedIn: 'root'
})

export class MessageHandlerService {

  private _messages: message[];
  constructor() {
    this._messages = [];
   }

  private isArray(message: message | message[] ): message is message[]{
    return message[0] !== undefined;
  }

  public handleMessage(message: message | message[]) {
    if (this.isArray(message))
      this._messages = this._messages.concat(message);
    else
      this._messages.push(message); 
  }

  get message(): message[]{
    return this._messages;
  }

  public hasMessages() : boolean{
    return this._messages.length > 0;
  }

  public clearMessages(){
    this._messages = [];
  }
}
