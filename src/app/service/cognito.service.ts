import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import * as AWS from "aws-sdk/global";
import * as awsservice from "aws-sdk/lib/service";
import * as CognitoIdentity from "aws-sdk/clients/cognitoidentity";
import {Credentials, CredentialsOptions} from "aws-sdk/lib/credentials";



/**
 * Created by Vladimir Budilov
 */

export interface CognitoCallback {
    cognitoCallback(message: string, result: any): void;

    handleMFAStep?(challengeName: string, challengeParameters: ChallengeParameters, callback: (confirmationCode: string) => any): void;
}

export interface LoggedInCallback {
    isLoggedIn(message: string, loggedIn: boolean): void;
}

export interface ChallengeParameters {
    CODE_DELIVERY_DELIVERY_MEDIUM: string;

    CODE_DELIVERY_DESTINATION: string;
}

export interface Callback {
    callback(): void;

    callbackWithParam(result: any): void;
}





@Injectable()
export class CognitoUtil {

    
    getCognitoIdentity():CognitoIdentity {
        AWS.config.region = environment.region; 
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: environment.identityPool
        });

        return new  CognitoIdentity();
    }


    getSamlCredentials(samlResponse: string, callback: Callback) : void {
          
    var role = environment.roleSelectedArn;
    console.log('inside getSamlCredentials');
    
    var Logins = {};
    Logins[environment.samlIdpArn] = samlResponse;
    console.log('Login Map: ');
    console.log(Logins);
    
    var params = {
        IdentityId: environment.identityId,
        CustomRoleArn: role,
        Logins
    };

    this.getCognitoIdentity().getCredentialsForIdentity(params, function (err, data) {
        if (err) {
            console.log("CognitoUtil: Can't set the credentials:" + err);
            callback.callbackWithParam(null);
        }
        else {
            if (data.Credentials) {
                callback.callbackWithParam(data.Credentials);
            } else {
                console.log("CognitoUtil: Got the id token, but the session isn't valid");
            }
        }
    });
    }

}
