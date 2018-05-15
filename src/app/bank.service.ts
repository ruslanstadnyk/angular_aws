import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Bank } from './bank';

const BANK : Bank[] = [
  {id: 1, name: 'Capital One', capital: 1000000, client: 100},
  {id: 2, name: 'Capital Two', capital: 2000000, client: 200 },
  {id: 3, name: 'Capital Three', capital: 3000000, client: 300},
    ];

@Injectable()
export class BankService{
  private baseUrl: string = 'https://lgujs19878.execute-api.us-east-1.amazonaws.com/test';
  constructor(private http : Http){
  }

  getAll(): Observable<Bank[]>{
    console.log("get All-----");
    let bank$ = this.http
      .get(`${this.baseUrl}/bank`).map(mapBanks)
      .catch(handleError);
      
      return bank$;
  }

  private getHeaders(){
    // I included these headers because otherwise FireFox
    // will request text/html
    let headers = new Headers();
    headers.append('Accept', 'application/json');

    return headers;
  }
  get(id: number): Observable<Bank> {
    let bank$ = this.http
      .get(`${this.baseUrl}/bank/${id}`, {headers: this.getHeaders()})
      .map(mapBank)
      .catch(handleError);
      return bank$;
  }

  save(bank: Bank) : Observable<Response>{
    return this
      .http
      .put(`${this.baseUrl}/bank/${bank.id}`, 
            JSON.stringify(bank), 
            {headers: this.getHeaders()});
  }

}


function mapBanks(response:Response): Bank[]{

  //throw new Error('ups! Force choke!');

  // The response of the API has a results
  // property with the actual results
  return response.json().results.map(toBank)
}

function toBank(r:any): Bank{
  let bank = <Bank>({
    id: extractId(r),
    url : r.url,
    name: r.name,
    capital: Number.parseInt(r.capital),
    client: Number.parseInt(r.client),
  });
  console.log('Parsed bank:', bank);
  return bank;
}

// to avoid breaking the rest of our app
// I extract the id from the bank url
function extractId(bankData:any){
  let extractedId = bankData.url.replace('uri','').replace('/','');
  return parseInt(extractedId);
}

function mapBank(response:Response): Bank{
   // toBank looks just like in the previous example
   return toBank(response.json());
}

// this could also be a private method of the component class
function handleError (error: any) {
  // log error
  // could be something more sofisticated
  let errorMsg = error.message || `Yikes! There was a problem with our hyperdrive device and we couldn't retrieve your data!`
  console.error(errorMsg);

  // throw an application level error
  return Observable.throw(errorMsg);
}

