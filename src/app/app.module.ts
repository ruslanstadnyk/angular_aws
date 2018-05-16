import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { BankListComponent } from './bank-list/bank-list.component';
import { BankService } from './bank.service';
import { BankDetailsComponent } from './bank-details/bank-details.component';
import {CognitoUtil} from "./service/cognito.service";
import {ApigClientFactory} from "./service/apigClient.service";


import { AppRoutingModule } from './app-routing.module';
import { MinValidatorDirective } from './min-validator.directive';
import { MaxValidatorDirective } from './max-validator.directive';

@NgModule({
  declarations: [
    AppComponent,
    BankListComponent,
    BankDetailsComponent,
    MinValidatorDirective,
    MaxValidatorDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
  ],
  providers: [BankService,CognitoUtil, ApigClientFactory],
  bootstrap: [AppComponent]
})
export class AppModule { }
