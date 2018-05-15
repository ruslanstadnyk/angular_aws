import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { BankService } from "../bank.service";
import {  Bank } from "../bank";

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styles: []
})
export class BankDetailsComponent implements OnInit, OnDestroy {
  bank: Bank;
  sub:any;

  constructor(private route: ActivatedRoute,
              private bankService: BankService,
              private router: Router) { }

  ngOnInit() { 
    this.sub = this.route.params.subscribe(params => {
      let id = Number.parseInt(params['id']);
      console.log('getting bank with id: ', id);
      this.bankService
        .get(id)
        .subscribe(p => this.bank = p);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  gotoBanksList(){
    let link = ['/banks'];
    this.router.navigate(link);
  }

  saveBankDetails(){
      this.bankService
          .save(this.bank)
          .subscribe(r => console.log(`saved!!! ${JSON.stringify(this.bank)}`));
  }

  
}
