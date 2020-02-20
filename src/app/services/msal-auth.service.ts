import { Injectable } from '@angular/core';
import { UserAgentApplication } from 'msal'
import { ErrorHandlerService } from './error-handler.service';
import { promise } from 'protractor';
import { resolve } from 'url';
import { Person, Restaurant } from './onmangeou.service';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { MessageHandlerService } from './message-handler.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MsalAuthService {

  private _isLogon: boolean;
  private _msalConfig;
  private _graphConfig;
  private _requestObj;
  private _myMSALObj;
  public data;
  private _isProcessed: Promise<boolean>;
  private restaurantUrl = environment.apiEndpoint + "restaurants/";
  private _voted: boolean;
  private _restaurantVotedId: Restaurant["id"] = "0";
  private _userSubject = new Subject<Person>();


  constructor(private errorHandler: ErrorHandlerService, private _messageHandler : MessageHandlerService, private httpClient : HttpClient) {
    this._isLogon = false;
    this._msalConfig = {
      oauth2AllowImplicitFlow: true,
      auth: {
        clientId: '6e0a00a9-123a-496d-9778-0d79b3801371', //This is your client ID
      },
      cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true
      }
    }
    this._graphConfig = {
      graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
    }

    // create a request object for login or token request calls
    // In scenarios with incremental consent, the request object can be further customized
    this._requestObj = {
      scopes: ["user.read"]
    }

    this._myMSALObj = new UserAgentApplication(this._msalConfig);

    // Register Callbacks for redirect flow
    // myMSALObj.handleRedirectCallbacks(acquireTokenRedirectCallBack, acquireTokenErrorRedirectCallBack);
    this._myMSALObj.handleRedirectCallback(this.authRedirectCallBack);

    //Always start with acquireTokenSilent to obtain a token in the signed in user from cache
    //this._isProcessed = new Promise((resolve, reject) => {
    let self = this;
    this._myMSALObj.acquireTokenSilent(this._requestObj).then(function (tokenResponse) {
      self.callMSGraph(self._graphConfig.graphMeEndpoint, tokenResponse.accessToken, self.graphAPICallback);
    }).catch(function (error) {
      self._isLogon = false;
    });
    //});

  }

  private showWelcomeMessage() {
    console.log("Welcome " + this._myMSALObj.getAccount().userName + " to Microsoft Graph API");
  }

  public signIn() {
    const self = this;
    this._myMSALObj.loginPopup(this._requestObj).then(function (loginResponse) {
      //Successful login
      self.showWelcomeMessage();
      //Call MS Graph using the token in the response
      self.acquireTokenPopupAndCallMSGraph();

    }).catch(function (error) {
      //Please check the console for errors
      console.log(error);
      self.errorHandler.handleError(error);
    });
  }


  public signOut() {
    let self = this;
    this._myMSALObj.logout().then(() => {
      self._isLogon = false;
    })
      .catch(function (error) {
        //Please check the console for errors
        console.log(error);
        self.errorHandler.handleError(error);
      });
  }


  private authRedirectCallBack(error, response) {
    if (error) {
      console.log(error);
      this.errorHandler.handleError(error);
    } else {
      if (response.tokenType === "access_token") {
        this.callMSGraph(this._graphConfig.graphMeEndpoint, response.accessToken, this.graphAPICallback);
      } else {
        console.log("token type is:" + response.tokenType);
      }
    }
  }

  private graphAPICallback(data) {
    this.data = JSON.stringify(data, null, 2);
    //console.log(data);
  }

  private callMSGraph(theUrl, accessToken, callback) {
    let self = this;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200)
        console.log(JSON.parse(this.responseText));
      self.data = JSON.parse(this.responseText);
      self._isLogon = true;
      console.log("logged !");
      
    // Create persons observer object
    const myRestaurantObserver = {
      next: (x: Restaurant) => {
        self._voted = true;
        self._restaurantVotedId = x.id;
        self._messageHandler.handleMessage( { header: "Vous avez déjà voté aujourd'hui",
                                              details: "Vous pouvez changer votre choix en décidant d'aller à un autre endroit ou en indiquant que vous n'êtes pas disponible."
                                            });
      },
      error: err => {
        self._restaurantVotedId = "";
        self._voted = false;
      },
      complete: () => console.log('Restaurants Observer got a complete notification '),
    };

      console.log("auth is logon juste avant l'appel au serveur");
      self.httpClient.get<Restaurant>(environment.apiEndpoint + "surveys/" + self.data.id + '/restaurant/')
        .subscribe(myRestaurantObserver);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xmlHttp.send();
  }

  private acquireTokenPopupAndCallMSGraph() {
    const self = this;
    //Always start with acquireTokenSilent to obtain a token in the signed in user from cache
    this._myMSALObj.acquireTokenSilent(this._requestObj).then(function (tokenResponse) {
      self.callMSGraph(self._graphConfig.graphMeEndpoint, tokenResponse.accessToken, self.graphAPICallback);
    }).catch(function (error) {
      console.log(error);
      self.errorHandler.handleError(error);
      // Upon acquireTokenSilent failure (due to consent or interaction or login required ONLY)
      // Call acquireTokenPopup(popup window) 
      if (self.requiresInteraction(error.errorCode)) {
        self._myMSALObj.acquireTokenPopup(self._requestObj).then(function (tokenResponse) {
          self.callMSGraph(self._graphConfig.graphMeEndpoint, tokenResponse.accessToken, self.graphAPICallback);
        }).catch(function (error) {
          console.log(error);
          self.errorHandler.handleError(error);
        });
      }
    });
  }

  /*
  //This function can be removed if you do not need to support IE
  public acquireTokenRedirectAndCallMSGraph() {
      //Always start with acquireTokenSilent to obtain a token in the signed in user from cache
      this._myMSALObj.acquireTokenSilent(this.requestObj).then(function (tokenResponse) {
          callMSGraph(graphConfig.graphMeEndpoint, tokenResponse.accessToken, graphAPICallback);
      }).catch(function (error) {
          console.log(error);
          // Upon acquireTokenSilent failure (due to consent or interaction or login required ONLY)
          // Call acquireTokenRedirect
          if (requiresInteraction(error.errorCode)) {
              myMSALObj.acquireTokenRedirect(requestObj);
          }
      });
  }*/
  private requiresInteraction(errorCode) {
    if (!errorCode || !errorCode.length) {
      return false;
    }
    return errorCode === "consent_required" ||
      errorCode === "interaction_required" ||
      errorCode === "login_required";
  }

  /*
  // Browser check variables
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf('MSIE ');
  var msie11 = ua.indexOf('Trident/');
  var msedge = ua.indexOf('Edge/');
  var isIE = msie > 0 || msie11 > 0;
  var isEdge = msedge > 0;
  
  //If you support IE, our recommendation is that you sign-in using Redirect APIs
  //If you as a developer are testing using Edge InPrivate mode, please add "isEdge" to the if check
  
  // can change this to default an experience outside browser use
  var loginType = isIE ? "REDIRECT" : "POPUP";
  
  // runs on page load, change config to try different login types to see what is best for your application
  if (loginType === 'POPUP') {
      if (myMSALObj.getAccount()) {// avoid duplicate code execution on page load in case of iframe and popup window.
          showWelcomeMessage();
          acquireTokenPopupAndCallMSGraph();
      }
  }
  else if (loginType === 'REDIRECT') {
      document.getElementById("SignIn").onclick = function () {
          myMSALObj.loginRedirect(requestObj);
      };
  
      if (myMSALObj.getAccount() && !myMSALObj.isCallback(window.location.hash)) {// avoid duplicate code execution on page load in case of iframe and popup window.
          showWelcomeMessage();
          acquireTokenRedirectAndCallMSGraph();
      }
  } else {
      console.error('Please set a valid login type');
  }*/


  public logoff() {
    console.log("logoff...");
    this._isLogon = false;
  }
  get isLogon(): boolean {
    return this._isLogon;
  }
  get isProcessed(): Promise<boolean> {
    return this._isProcessed;
  }
  
  public vote(restaurant: Restaurant["id"], comment?: string) {
    let person: Person = {
      id: this.data.id,
      name: this.data.displayName,
      comment: comment
    }


    // Create persons observer object
    const myPersonObserver = {
      next: (x: Person) => {
        console.log("voted !");
        this._voted = true;
        this._restaurantVotedId = restaurant;
        this._userSubject.next(x);
      },
      error: err => {
        this.errorHandler.handleError(err);
        this._restaurantVotedId = ""
      },
      complete: () => console.log('Restaurants Observer got a complete notification '),
    };

    if (this.isLogon === true)
      this.httpClient.post<Person>(this.restaurantUrl + restaurant + '/surveys/', person)
        .subscribe(myPersonObserver)
  }

  public get voted(): boolean {
    return this._voted;
  }

  public get userSubject(): Subject<Person> {
    return this._userSubject;
  }
  public get restaurantVotedId(): Restaurant["id"] {
    return this._restaurantVotedId;
  }

}
