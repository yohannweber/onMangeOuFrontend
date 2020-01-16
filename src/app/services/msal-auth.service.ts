import { Injectable } from '@angular/core';
import { UserAgentApplication } from 'msal'
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class MsalAuthService {

  private _isLogon : boolean;
  private _msalConfig;
  private _graphConfig;
  private _requestObj;
  private _myMSALObj;
  public data;

  constructor(private errorHandler : ErrorHandlerService) { 
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

let self = this;
//Always start with acquireTokenSilent to obtain a token in the signed in user from cache
this._myMSALObj.acquireTokenSilent(this._requestObj).then(function (tokenResponse) {
    self.callMSGraph(self._graphConfig.graphMeEndpoint, tokenResponse.accessToken, self.graphAPICallback);
}).catch(function (error) {
    console.log(error);
    self.errorHandler.handleError(error);
    self._isLogon = false;
});

}

private showWelcomeMessage() {
  console.log( "Welcome " + this._myMSALObj.getAccount().userName + " to Microsoft Graph API" );
}

public signIn(){
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
    this._myMSALObj.logout().then(()=>{
      self._isLogon = false;
    })
    .catch(function(error){
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
        console.log(this.response);
        self.data = this.response;
        self._isLogon = true;
            //callback(JSON.parse(this.responseText));
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
public requiresInteraction(errorCode) {
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

  
  public logoff(){
    console.log("logoff...");
    this._isLogon = false;
  }
  get isLogon(): boolean{
    return this._isLogon;
  }

}
