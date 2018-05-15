import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BankListComponent } from "./bank-list/bank-list.component";
import { BankDetailsComponent } from "./bank-details/bank-details.component";

// Route config let's you map routes to components
const routes: Routes = [
  // map '/banks' to the bank list component
  {
    path: 'banks',
    component: BankListComponent,
  },
  // map '/banks/:id' to bank details component
  {
    path: 'banks/:id', 
    component: BankDetailsComponent 
  },
  // map '/' to '/banks' as our default route
  {
    path: '',
    redirectTo: '/banks',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
