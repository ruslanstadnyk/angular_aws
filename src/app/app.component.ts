import { Component,  OnInit} from '@angular/core';

import {CognitoUtil, LoggedInCallback} from "./service/cognito.service";
import { environment } from "../environments/environment";
import * as CognitoIdentity from "aws-sdk/clients/cognitoidentity";
import { CognitoIdentityCredentials } from 'aws-sdk/global';



var identityId = localStorage.getItem('cognitoid');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements  OnInit{
  title = 'Local banks only PPlz!!!';

  
  constructor(public cognito: CognitoUtil) { 
    console.log("AppComponent: constructor");

    console.log("==",cognito);
}


  ngOnInit() { 
    var identityId = localStorage.getItem('cognitoid');

    if (identityId != null &&  identityId != 'undefined'){
      console.log('Identity ID==: ' + identityId);
      console.log('Identity ID=1=: ' + typeof identityId);
  
      this.loginWorkflow();
  }else {
      console.log('Calling GetID',this.cognito);
      let cic:CognitoIdentityCredentials = <CognitoIdentityCredentials>this.cognito.getCognitoIdentity().config.credentials;
      console.log('Calling ident',cic.params['IdentityPoolId']);


        localStorage.setItem('cognitoid', cic.params['IdentityPoolId']);
        identityId = localStorage.getItem('cognitoid');
        this.loginWorkflow();
  }
}

 loginWorkflow(){
  var activelogin = sessionStorage.getItem('activelogin');
  console.log("LOGIN Workflow" + activelogin);
  if (activelogin=='inProgress'){                                   //ADFS login redirect from API Gateway
      var samlResponse = this.getParameterByName('SAMLResponse');
      sessionStorage.removeItem('activelogin');
      if (samlResponse != null){
        localStorage.setItem('samlResponse', samlResponse);
      }
  } 
  else if (activelogin === null) {                                 //First page visit. Redirect to ADFS login.
      var RPID = encodeURIComponent(environment.relayingPartyId);
      var result = environment.adfsUrl + "?loginToRp=" + RPID;
      sessionStorage.setItem('activelogin', 'inProgress');
      //window.location.href = result;
  }   
  else {//Credentials exist, page refresh, etc.
      console.log('activelogin already exists in session and the value is ' + activelogin);
  }
}

 getParameterByName(name) {
   let url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

}
