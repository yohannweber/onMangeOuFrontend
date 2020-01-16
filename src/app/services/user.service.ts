import { Injectable } from '@angular/core';
import { MsalAuthService } from './msal-auth.service';
import { Restaurant } from './onmangeou.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private auth : MsalAuthService ) { }

  public isLogon() : boolean {
    return this.auth.isLogon;
  }

  public vote(restaurant : Restaurant["id"]){
    
  }

  public getRestaurantId() : Restaurant["id"]{
    return "2";
  }
}
