import { Component } from '@angular/core';
import { MsalAuthService } from './services/msal-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'onMangeOuFront';
  constructor(public auth: MsalAuthService){
  }

}
