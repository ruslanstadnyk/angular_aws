import { Component, OnInit } from '@angular/core';
import { Bank } from '../bank';
import { BankService } from "../bank.service";

@Component({
  selector: 'app-bank-list',
  template: `
  <section *ngIf="isLoading && !errorMessage">
  Loading our hyperdrives!!! Retrieving data...
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

  constructor(private bankService: BankService) { }

  ngOnInit(){

    this.bankService
      .getAll()
      .subscribe(
         /* happy path */ p => this.banks = p,
         /* error path */ e => this.errorMessage = e,
         /* onCompleted */ () => this.isLoading = false);
  }

}
