/*
 * Copyright 2010-2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/fromPromise';



import {APIGatewayClient, Utils, uritemplate} from 'aws-api-client'

export class ApigClient {
    constructor(private apiGatewayClient : APIGatewayClient, private pathComponent:string, private authType:string, private apiKey:string ){
    }

    // checkGet(params, body, additionalParams):Observable<any> {
    //     if(additionalParams === undefined) { additionalParams = {}; }
    //     var utils = new Utils();
        
    //     utils.assertParametersDefined(params, [], ['body']);
        
    //     var checkGetRequest = {
    //         verb: 'get'.toUpperCase(),
    //         path: this.pathComponent + uritemplate('/check').expand(utils.parseParametersToObject(params, [])),
    //         headers: utils.parseParametersToObject(params, []),
    //         queryParams: utils.parseParametersToObject(params, []),
    //         body: body
    //     };
        
    //     return   Observable.fromPromise(this.apiGatewayClient.makeRequest(checkGetRequest, this.authType, additionalParams, this.apiKey));
        
    // };
    
    checkGet(params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        var utils = new Utils();
        
        utils.assertParametersDefined(params, [], ['body']);
        
        var checkGetRequest = {
            verb: 'get'.toUpperCase(),
            path: this.pathComponent + uritemplate('/check').expand(utils.parseParametersToObject(params, [])),
            headers: utils.parseParametersToObject(params, []),
            queryParams: utils.parseParametersToObject(params, []),
            body: body
        };
        
        return   this.apiGatewayClient.makeRequest(checkGetRequest, this.authType, additionalParams, this.apiKey);
        
    };
    

    rootGet(params, body, additionalParams):Observable<any>{
        if(additionalParams === undefined) { additionalParams = {}; }
        var utils = new Utils();
        
        utils.assertParametersDefined(params, [], ['body']);
        
        var rootGetRequest = {
            verb: 'get'.toUpperCase(),
            path: this.pathComponent + uritemplate('/').expand(utils.parseParametersToObject(params, [])),
            headers: utils.parseParametersToObject(params, []),
            queryParams: utils.parseParametersToObject(params, []),
            body: body
        };
        
        return   Observable.fromPromise(this.apiGatewayClient.makeRequest(rootGetRequest, this.authType, additionalParams, this.apiKey));
        
    };
    

    checkPost(params, body, additionalParams):Observable<any> {
        if(additionalParams === undefined) { additionalParams = {}; }
         var utils = new Utils();
        
        utils.assertParametersDefined(params, [], ['body']);
        
        var checkPostRequest = {
            verb: 'post'.toUpperCase(),
            path: this.pathComponent + uritemplate('/check').expand(utils.parseParametersToObject(params, [])),
            headers: utils.parseParametersToObject(params, []),
            queryParams: utils.parseParametersToObject(params, []),
            body: body
        };
        return   Observable.fromPromise(this.apiGatewayClient.makeRequest(checkPostRequest, this.authType, additionalParams, this.apiKey));
    };
    


    // bankGet(params, body, additionalParams) {
    //     if(additionalParams === undefined) { additionalParams = {}; }
    //     var utils = new Utils();
        
    //     utils.assertParametersDefined(params, [], ['body']);
        
    //     var bankGetRequest = {
    //         verb: 'get'.toUpperCase(),
    //         path: this.pathComponent + uritemplate('/bank').expand(utils.parseParametersToObject(params, [])),
    //         headers: utils.parseParametersToObject(params, []),
    //         queryParams: utils.parseParametersToObject(params, []),
    //         body: body
    //     };
        
        
    //     return this.apiGatewayClient.makeRequest(bankGetRequest, this.authType, additionalParams, this.apiKey);
    // };
    


   
}

@Injectable()
export class ApigClientFactory {


newClient(config): ApigClient {
    console.log("cLIENT======dddd=======",config);
    if(config === undefined) {
        config = {
            accessKey: '',
            secretKey: '',
            sessionToken: '',
            region: '',
            apiKey: undefined,
            defaultContentType: 'application/json',
            defaultAcceptType: 'application/json'
        };
    }
    if(config.accessKey === undefined) {
        config.accessKey = '';
    }
    if(config.secretKey === undefined) {
        config.secretKey = '';
    }
    if(config.apiKey === undefined) {
        config.apiKey = '';
    }
    if(config.sessionToken === undefined) {
        config.sessionToken = '';
    }
    if(config.region === undefined) {
        config.region = 'us-east-1';
    }
    //If defaultContentType is not defined then default to application/json
    if(config.defaultContentType === undefined) {
        config.defaultContentType = 'application/json';
    }
    //If defaultAcceptType is not defined then default to application/json
    if(config.defaultAcceptType === undefined) {
        config.defaultAcceptType = 'application/json';
    }

    
    // extract endpoint and path from url
    //var invokeUrl = 'https://lgujs19878.execute-api.us-east-1.amazonaws.com/test';
    var invokeUrl = 'https://1ejbudder0.execute-api.us-east-1.amazonaws.com/dev'
    //var invokeUrl ='https://6i523p7rbb.execute-api.us-east-1.amazonaws.com/dev';
    var endpoint = /(^https?:\/\/[^\/]+)/g.exec(invokeUrl)[1];
    var pathComponent = invokeUrl.substring(endpoint.length);

    var sigV4ClientConfig = {
        accessKey: config.accessKey,
        secretKey: config.secretKey,
        sessionToken: config.sessionToken,
        serviceName: 'execute-api',
        region: config.region,
        endpoint: endpoint,
        defaultContentType: config.defaultContentType,
        defaultAcceptType: config.defaultAcceptType
    };

    var authType = 'NONE';
    if (sigV4ClientConfig.accessKey !== undefined && sigV4ClientConfig.accessKey !== '' && sigV4ClientConfig.secretKey !== undefined && sigV4ClientConfig.secretKey !== '') {
        authType = 'AWS_IAM';
    }

    var simpleHttpClientConfig = {
        endpoint: endpoint,
        defaultContentType: config.defaultContentType,
        defaultAcceptType: config.defaultAcceptType
    };

    var apiGatewayClient = new APIGatewayClient(simpleHttpClientConfig, sigV4ClientConfig);
    
    var apigClient = new ApigClient(apiGatewayClient,  pathComponent, authType, config.apiKey);

    return apigClient;
};

}