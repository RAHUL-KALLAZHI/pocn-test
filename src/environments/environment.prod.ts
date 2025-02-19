// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  graphqlAnonymous:'https://dev-dcp.pocnconnect.com/graphql',
  graphqlShielded:'https://dev-dcp.pocnconnect.com/shield/graphql',
  postProfileImgUrl:'https://next-dev.pocnconnect.com/uiimage/profile_images/',
  postImgUrl:'https://next-dev.pocnconnect.com/uiimage/post_content/',
  grpImgUrl:'https://next-dev.pocnconnect.com/uiimage/group_images/',
  telemetryUrl:'https://otlp-apm-infra-dev.pocnconnect.com/v1/trace',
  serviceName: 'POCN UX',
  twilioServerURL:"https://dev-dialer-api.pocnconnect.com",
  imageProxyKey:'958c5b1aff54420abca1caecfc5e8134d4460653b0bab8bde26723a422df49e56c74b887da83298c943809e2b0b67f125f3070c11ce4b33ee5310a011a39d352',
  imageProxySalt:'d5c7ba8e93e11612e0fc5bebdb1f20fcf9f0fe43c7ac0730d0be2bd0d324193446fefbb20cddf64d4be48bfd36d7a97951388810ba3c5cabbc0cdeab33711ef6',
  imageProxyUrl:'https://dev-images.pocnconnect.com',
  groupLink:'https://next-dev.pocnconnect.com',
  videoCallInviteLink: 'https://dev.pocnconnect.com',

  // graphqlAnonymous:'https://uat-dcp-infra.pocnconnect.com/graphql',
  // graphqlShielded:'https://uat-dcp-infra.pocnconnect.com/shield/graphql',
  // // idpLoginURL:"https://dev-idp.pocnconnect.com/auth/realms/POCN/protocol/openid-connect/auth?client_id=pocnconnect&redirect_uri=https%3A%2F%2Fdev.pocnconnect.com%2Fpre-authorization%2F&state=681051d9-5573-4830-8fab-297aef046df2&response_mode=fragment&response_type=code&scope=openid",
  // // idpLogoutURL:'https://dev-idp.pocnconnect.com/auth/realms/POCN/protocol/openid-connect/logout',
  // // idpredirectURL:'https://dev.pocnconnect.com/pre-authorization/',
  // twilioServerURL:"https://uat-dialer-api.pocnconnect.com",
  // postProfileImgUrl:'https://uat-images.pocnconnect.com/profile_images/',
  // postImgUrl:'https://uat-images.pocnconnect.com/post_content/',
  // grpImgUrl:'https://uat-images.pocnconnect.com/group_images/',
  // telemetryUrl:'https://otlp-apm-infra-uat.pocnconnect.com/v1/trace',
  // serviceName: 'POCN UX',
  // imageProxyKey:'958c5b1aff54420abca1caecfc5e8134d4460653b0bab8bde26723a422df49e56c74b887da83298c943809e2b0b67f125f3070c11ce4b33ee5310a011a39d352',
  // imageProxySalt:'d5c7ba8e93e11612e0fc5bebdb1f20fcf9f0fe43c7ac0730d0be2bd0d324193446fefbb20cddf64d4be48bfd36d7a97951388810ba3c5cabbc0cdeab33711ef6',
  // imageProxyUrl:'https://dev-images.pocnconnect.com',

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
