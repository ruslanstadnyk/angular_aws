import { Component, OnInit } from '@angular/core';
import { Bank } from '../bank';
import { BankService } from "../bank.service";
import {CognitoUtil, LoggedInCallback} from "../service/cognito.service";
import {ApigClient, ApigClientFactory} from "../service/apigClient.service";
import * as AWS from "aws-sdk/global";
import { environment } from "../../environments/environment";



AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: environment.identityPool
});


@Component({
  selector: 'app-bank-list',
  template: `
  <section *ngIf="isLoading && !errorMessage">
  Loading our hyperdrives!!! Retrieving data...

  <button (click)="getBanks()">get Banks</button>

  </section>
  <!-- this is the new syntax for ng-repeat -->
  <ul>
    <li *ngFor="let bank of banks">
      <a [routerLink]="['/banks', bank.id]">
        {{bank.name}} 
      </a>
    </li>
  </ul>
  <!-- HERE: added this error message -->
  <section *ngIf="errorMessage">
    {{errorMessage}}

  </section>
  `,
  styleUrls: ['./bank-list.component.scss']
})
export class BankListComponent implements OnInit {
  banks: Bank[] = [];
  errorMessage: string = '';
  isLoading: boolean = true;



  constructor(private bankService: BankService, public cognito: CognitoUtil, public apigClientFactory: ApigClientFactory) { 
      console.log("AppComponent: constructor");
  
      console.log("==",cognito);
  
      console.log("==",apigClientFactory);
  }

  ngOnInit(){
    let samlResponse : string = localStorage.getItem('samlResponse');

    this.cognito.getSamlCredentials(samlResponse, {
      callback() {
  
      },
      callbackWithParam(cred: any) {
          // Include the passed-in callback here as well so that it's executed downstream
          console.log("AppComponent: calling initAwsService in callback",cred);
          AWS.config.credentials.accessKeyId = cred.AccessKeyId;
          AWS.config.credentials.secretAccessKey = cred.SecretKey;
          AWS.config.credentials.sessionToken = cred.SessionToken;
      }
  
      
  });

  //   this.bankService
  //     .getAll()
  //     .subscribe(
  //        /* happy path */ p => this.banks = p,
  //        /* error path */ e => this.errorMessage = e,
  //        /* onCompleted */ () => this.isLoading = false);
   }


   getBanks(){

  
    var params = {};
    var body = {};
    var additionalParams = {};
    
    var apigwClient = this.apigClientFactory.newClient({
      accessKey: AWS.config.credentials.accessKeyId,
      secretKey: AWS.config.credentials.secretAccessKey,
      sessionToken: AWS.config.credentials.sessionToken,
      region: "us-east-1"
    });
  
    
    apigwClient.bankGet(params, body, additionalParams)
      .then(function (result) {
          console.log(result);
          alert('Successful ping: ' + result.data.status + ' - ' + result.data.agent);
      }).catch(function (result) {
          alert('Failed ping');
          console.log(result);
      });
    
  
   }
  
   



 


 




}
