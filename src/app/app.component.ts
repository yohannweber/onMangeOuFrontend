import { Component } from '@angular/core';
import { MsalAuthService } from './services/msal-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = "Où est-ce qu'on mange à midi";
  constructor(public auth: MsalAuthService){
  }

}
