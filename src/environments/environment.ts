// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  region: 'us-east-1',
  identityPool: 'us-east-1:d2c5da21-1c7d-410d-83af-10dc937290fa',
  adfsUrl: 'https://localhost/adfs/ls/IdpInitiatedSignOn.aspx',
  samlIdpArn: 'arn:aws:iam::845909373636:saml-provider/ADFSTEST',
  relayingPartyId: 'urn:amazon:webservices', 
  roleSelectedArn : 'arn:aws:iam::845909373636:role/ADFS-Dev',
  identityId : 'us-east-1:63f4ecf5-7689-4b24-959f-fb813a155eaa'
};
