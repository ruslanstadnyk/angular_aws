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
  <button (click)="getBanks()">get Banks</button>
  <section *ngIf="isLoading && !errorMessage">
  Loading our hyperdrives!!! Retrieving data...
  </section>
  <!-- this is the new syntax for ng-repeat -->
  <p>{{status}}</p>
  <ul>
  <li *ngFor="let message of messages">
    
      {{message}} 
    
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
  
  messages :string[] = [];
  status :any;
  statusObj :any;
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
    var body = "2002";
    var additionalParams = {};
    
    var apigwClient = this.apigClientFactory.newClient({
      accessKey: AWS.config.credentials.accessKeyId,
      secretKey: AWS.config.credentials.secretAccessKey,
      sessionToken: AWS.config.credentials.sessionToken,
      region: "us-east-1"
    });
  
    apigwClient.checkPost(params, body, additionalParams).subscribe(  
             /* happy path */ p => {
               //this.messages = p.data.slice(1);
               console.log("PE",p);

               var dt :Array<string> =  p.data;
               this.status = JSON.parse(JSON.stringify('{'+dt[0]+'}').replace(/\s/g,"").replace("TheS3MemeberAssetfetched",'"TheS3MemeberAssetfetched"')) ;
               this.messages = dt.slice(1); 
               console.log("DDTT==",this.status);
for(var prop in this.status){
console.log("typopoppp", typeof this.status);
}

              console.log("se",this.status);
//              console.log("ms",this.messages);

            },
              /* error path */ e => this.errorMessage = e,
              /* onCompleted */ () => this.isLoading = false) ;

    // apigwClient.checkGet(params, body, additionalParams)
    //   .then(function (result) {
    //       console.log(result);
    //       alert('Successful ping: ' + result.data.status + ' - ' + result.data.agent);
    //   }).catch(function (result) {
    //       alert('Failed ping');
    //       console.log(result);
    //   });
    
  
   }
  
   



 


 




}
