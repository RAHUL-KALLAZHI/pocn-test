import gql from 'graphql-tag';


export const mutations = {

    createUser: gql`
mutation pocnSignupUserIam (
    $email:String,
    $firstname:String,
    $graduationYear:Int,
    $state:String,
    $providerType:String,
    $lastname:String,
    $npi:String,
    $password:String,
    $ipAddressV4:String,
    $ipAddressV6:String,    
    $channel:String,
    $leadSource:String,
    $promoCode:String,
    $medium:String,
    $optStatus:String,
    $regProgram:String,
    $userType:String,
    $utmMedium:String,
    $utmSource:String
    $device:String
    $timezone:String
   ){
    pocnSignupUserIam(
     input: {
      signupUserInput: {
        email: $email
        firstname: $firstname
        graduationYear: $graduationYear
        state: $state
        providerType: $providerType
        lastname:$lastname
        npi: $npi
        password: $password
      }
      signupUserLogInput: {
        channel: $channel
        ipAddressV4: $ipAddressV4
        ipAddressV6: $ipAddressV6
        leadSource: $leadSource
        promoCode: $promoCode
        medium: $medium
        optStatus: $optStatus
        regProgram: $regProgram
        userType: $userType
        utmMedium: $utmMedium
        utmSource: $utmSource
        device: $device
        timezone: $timezone
      }
      sourceEnv: "web"
    }){
      signupUserIamResult{
      error
      message
      status
      data
      }
    }
  }
`,
establishSession: gql`
mutation pocnIamSsoEstablishSession (
    $accessCode:String!,
    $redirectUrl:String!
   ){
    pocnIamSsoEstablishSession(
     input: {
      establishSessionInput:{
			    accessCode:$accessCode
			    redirectUrl:$redirectUrl
			  }
    }){
      establishSessionResult{
			    status
			    error
			    message
			    data{
			      jwToken
			      accessToken
            refreshToken
			      userProfile{
              userId
              firstName
              middleName
              lastName
              npi
              email
			      }
        }
      }
    }
  }
`,
pocnIamEstablishSession: gql`
mutation pocnIamEstablishSession (
    $password:String!,
    $username:String!
    $ipAddressV4:String
    $ipAddressV6:String
    $device:String!
    $channel:String!
    $deviceLocation:String!
   ){
    pocnIamEstablishSession(
     input: {
      establishSessionInput:{
        password:$password
        username:$username
			}
      device: $device
      deviceLocation: $deviceLocation
      ipAddressV4: $ipAddressV4
      ipAddressV6: $ipAddressV6
      channel: $channel
      loginClass: "Activity"
    }
    ){
      establishSessionResult {
			    status
			    error
			    message
			    data {
          accessToken
          jwToken
          createdAt
          refreshToken
          userProfile {
            email
            firstName
            lastName
            middleName
            userId
            npi
          }
         }
      }
  }
}
`,
forgotPasswordApi: gql`
mutation forgotPasswordApi (
    $email:String!
    $domain:String
   ){
    forgotPasswordApi(
     input: {
      domain: $domain
      email: $email
    }
    ){
      forgotPasswordResult {
      error
      message
      status
    }
  }
}
`,
getResetPassword: gql`
mutation getResetPassword (
    $token:String!
   ){
    getResetPassword(
     input: {
      token: $token
    }
    ){
      getResetPasswordResult {
      error
      message
      status
    }
  }
}
`,
updatePassword: gql`
mutation updatePassword (
    $token:String!
    $password:String!
    $ipAddressV4:String,
    $ipAddressV6:String,
    $channel:String,
    $device:String,
    $geoLocation:String,
   ){
    updatePassword(
     input: {
      token: $token
      password: $password
      ipAddressV4:$ipAddressV4,
      ipAddressV6:$ipAddressV6,
      channel:$channel,
      device:$device,
      geoLocation:$geoLocation,
    }
    ){
      updatePasswordResult {
      error
      message
      status
    }
  }
}
`,
verifyUserWelcome: gql`
mutation verifyUserWelcome (
    $token:String!
   ){
    verifyUserWelcome(
     input: {
      token: $token
    }
    ){
      updatePasswordResult  {
      error
      message
      status
    }
  }
}
`,
updateUserProfileImage: gql`
mutation updateUserImage (
    $accessCode:String!,
    $fileContent: String!,
    $fileName: String!,
    $imgType: String!,
    $npi: String!,
    $providerId: String!,
    $userId: String!,
    $fileExtension: String!
   ) {
  updateUserImage(
    input: {
      accessToken: $accessCode
      userProfileInput: {
        fileContent: $fileContent
        fileExtension: $fileExtension
        fileName: $fileName
        imgType: $imgType
        npi: $npi
        providerId: $providerId
        userId: $userId
      }
    }
  ) {
    userProfileUpdateResponse{
      status
      error
      message
      data
    }
  }
}
`,
updateUserResume: gql`
mutation updateUserResume (
    $accessCode:String!,
    $fileContent: String!,
    $fileName: String!,
    $npi: String!,
    $providerId: String!,
    $userId: String!
   ) {
    updateUserResume(
    input: {
      accessToken: $accessCode
      userProfileInput: {
        fileContent: $fileContent
        fileName: $fileName
        npi: $npi
        providerId: $providerId
        userId: $userId
      }
    }
  ) {
    userProfileUpdateResponse{
      status
      error
      message
      data
    }
  }
}
`,
updateUserEducation: gql`
mutation updateUserEducation(
  $educationInput: [UserEducationProfileInputRecordInput],
  $accessToken:String
) {
  updateUserEducation(
    input: {
      userProfileInput: $educationInput
      accessToken: $accessToken
    }
  ) {
    userProfileUpdateResponse {
      data
      error
      message
      status
    }
  }
}`
,
updateUserContactProfile: gql`
mutation updateUserContactProfile(
  $contactProfileInput: [UserContactProfileInputRecordInput],
  $accessToken:String
) {
  updateUserContactProfile(
    input: {
      userProfileInput: $contactProfileInput
      accessToken: $accessToken
    }
  ) {
    userProfileUpdateResponse {
      data
      error
      message
      status
    }
  }
}`,

updateUserProfessionalProfile: gql`
mutation updateUserProfessionalProfile (
  $accessToken: String!,
  $userId: String,
  $npi: String,
  $providerId: String,
  $hcoDmcid: Int,
  $hcoName: String,
  $jobTitle: String,
  $startYear: String,
  $endYear: String,
  $hcoSubtype: String,
  $hcoStatus: String,
  $hcoAddress: String,
  $hcoUnit: String,
  $hcoLocality: String,
  $hcoStateProvince: String,
  $hcoPostcode: String,
  $hcoCountry: String,
  $bio: String,
  $isPrimary: Int,
  $employmentType : String,
  $description : String,
  $month: String
   ) {
    updateUserProfessionalProfile(
    input: {
      accessToken: $accessToken
      userProfileInput: {
        userId: $userId
        npi: $npi
        providerId: $providerId
        hcoDmcid: $hcoDmcid
        hcoName: $hcoName
        jobTitle: $jobTitle
        startYear: $startYear
        endYear: $endYear
        hcoSubtype: $hcoSubtype
        hcoStatus: $hcoStatus
        hcoAddress: $hcoAddress
        hcoUnit: $hcoUnit
        hcoLocality: $hcoLocality
        hcoStateProvince: $hcoStateProvince
        hcoPostcode: $hcoPostcode
        hcoCountry: $hcoCountry
        bio: $bio
        isPrimary: $isPrimary
        employmentType: $employmentType
        description: $description
        month: $month
      }
    }
  ) {
    userProfileUpdateResponse{
      status
      error
      message
      data
    }
  }
}
`,
updateUserBasicProfile: gql`
mutation updateUserBasicProfile (
      $accessToken: String!,
      $userId: String!,
      $email: String,
      $firstName: String,
      $lastName: String,
      $npi: String,
      $providerId: String,
      $aboutMe: String,
      $facebook: String,
      $twitter: String,
      $linkedin: String,
      $website: String,
      $profileTagLine: String,
      $primarySpecialityCode: String,
      $primarySpecialityDesc: String,
      $primarySpecialityGroup: String,
      $primarySpecialityGroupCode: String,
   ) {
    updateUserBasicProfile(
    input: {
      accessToken: $accessToken
      userProfileInput: {
        userId: $userId
        email: $email
        firstName: $firstName
        lastName: $lastName
        npi: $npi
        providerId: $providerId
        aboutMe: $aboutMe
        facebook: $facebook
        twitter: $twitter
        linkedin: $linkedin
        website: $website
        profileTagLine: $profileTagLine
        primarySpecialityCode: $primarySpecialityCode,
        primarySpecialityDesc: $primarySpecialityDesc,
        primarySpecialityGroup: $primarySpecialityGroup,
        primarySpecialityGroupCode: $primarySpecialityGroupCode,
      }
    }
  ) {
    userProfileUpdateResponse{
      status
      error
      message
      data
    }
  }
}
`,
updateUserAddressProfile: gql`
mutation updateUserAddressProfile(
  $addressInput: [UserAddressProfileInputRecordInput],
  $accessToken:String
) {
  updateUserAddressProfile(
    input: {
      userProfileInput: $addressInput
      accessToken: $accessToken
    }
  ) {
    userProfileUpdateResponse {
      data
      error
      message
      status
    }
  }
}`
,
updateUserExperience: gql`
mutation updateUserExperience(
  $workHistoryInput: [UserExperienceProfileInputRecordInput],
  $accessToken:String
) {
  updateUserExperience(
    input: {
      userProfileInput: $workHistoryInput
      accessToken: $accessToken
    }
  ) {
    userProfileUpdateResponse {
      data
      error
      message
      status
    }
  }
}`,

updateCertLicenseInfo: gql`
mutation updateCertLicenseInfo(
  $licenseInput: [UserCertLicenseInputRecordInput],
  $accessToken:String,

) {
  updateCertLicenseInfo(
    input: {
      userProfileInput: $licenseInput
      accessToken: $accessToken

    }
  ) {
    userProfileUpdateResponse {
      data
      error
      message
      status
    }
  }
}`,

addCallerHistory: gql`
mutation addCallerHistory(
      $fromPhone: String,
      $npi: String,
      $toPhone: String,
      $providerId: Int,
      $type:String,
      $userId: String,
      $duration: String,
      $accessToken:String
    )  {
  addCallerHistory(
    input: {
      callerHistoryInput: {
        fromPhone: $fromPhone
        npi:$npi
        toPhone: $toPhone
        providerId:$providerId
        type:$type
        userId: $userId
        duration:$duration
      }
      accessToken:$accessToken
    }
  ) {
    userProfileUpdateResponse {
      data
      error
      message
      status
    }
  }
}`
,
updateChannelPreferences: gql`
mutation updateChannelPreferences(
  $channelInput: [UserChannelPreferencesInputRecordInput],
  $accessToken:String,

) {
  updateChannelPreferences(
    input: {
      userChannelInput: $channelInput
      accessToken: $accessToken

    }
  ) {
    userProfileUpdateResponse {
      data
      error
      message
      status
    }
  }
}`
,
updateInterestedTopicsPreferences: gql`
mutation updateInterestedTopicsPreferences(
  $userTopicInput: [UserInterestedTopicsPreferencesInputRecordInput],
  $accessToken:String,

) {
  updateInterestedTopicsPreferences(
    input: {
      userInterestedInput: $userTopicInput
      accessToken: $accessToken

    }
  ) {
    userProfileUpdateResponse {
      data
      error
      message
      status
    }
  }
}`
,
updateInterestedAreasPreferences: gql`
mutation updateInterestedAreasPreferences(
  $userInterestedInput: [UserInterestedAreasPreferencesInputRecordInput],
  $accessToken:String,

) {
  updateInterestedAreasPreferences(
    input: {
      userInterestedInput: $userInterestedInput
      accessToken: $accessToken

    }
  ) {
    userProfileUpdateResponse {
      data
      error
      message
      status
    }
  }
}`,
updateUserOpportunity: gql`
mutation updateUserOpportunity(
  $userOpportunityInput: [UserOpportunityInputRecordInput],
  $accessToken:String,

) {
  updateUserOpportunity(
    input: {
      userOpportunityInput: $userOpportunityInput
      accessToken: $accessToken

    }
  ) {
    userProfileUpdateResponse {
      data
      error
      message
      status
    }
  }
}`
,
updateUserPrivilegeConfig: gql`
mutation updateUserPrivilegeConfig(
  $userPrivilegeInput: [UserPrivilegeInputRecordInput],
  $accessToken:String,

) {
  updateUserPrivilegeConfig(
    input: {
      userPrivilegeInput: $userPrivilegeInput
      accessToken: $accessToken

    }
  ) {
    userProfileUpdateResponse {
      data
      error
      message
      status
    }
  }
}`
,

updateUserPrivilegeConfigSingle: gql`
mutation updateUserPrivilegeConfigSingle(
  $userPrivilegeInput: [UserPrivilegeInputRecordInput],
  $accessToken:String,

) {
  updateUserPrivilegeConfig(
    input: {
      userPrivilegeInput: $userPrivilegeInput
      accessToken: $accessToken
    }
  ) {
    userProfileUpdateResponse {
      data
      error
      message
      status
    }
  }
}`,

submitApproveConnectionRequest: gql`
mutation submitApproveConnectionRequest (
      $accessToken: String!,
      $childFullName: String,
      $childUserId: String!,
      $connectionRequestId: Int,
      $parentFullName: String,
      $parentUserId: String,
      $requestorNpi: String,
      $targetNpi: String,
      $ipAddressV4:String,
      $ipAddressV6:String,      
      $device:String,
      $channel:String,
      $geoLocation:String
   ) {
    submitApproveConnectionRequest(
    input: {
      accessToken: $accessToken
      connectionApproveRequestInput: {
        childFullName: $childFullName
        childUserId: $childUserId
        connectionRequestId: $connectionRequestId
        parentFullName:  $parentFullName
        parentUserId: $parentUserId
        requestorNpi: $requestorNpi
        targetNpi: $targetNpi
        ipAddressV4: $ipAddressV4
        ipAddressV6: $ipAddressV6
        device:$device
        channel:$channel
        geoLocation: $geoLocation
      }
    }
  ) {
    connectionUpdateResponse {
      data
      error
      message
      status
    }
  }
}
`,
sendApproveConnectionRequestMail: gql`
mutation sendApproveConnectionRequestMail (
      $accessToken: String!,
      $childFullName: String,
      $childUserId: String!,
      $connectionRequestId: Int,
      $parentFullName: String,
      $parentUserId: String,
      $requestorNpi: String,
      $targetNpi: String,
      $ipAddressV4:String,
      $ipAddressV6:String,      
      $device:String,
      $channel:String,
      $geoLocation:String
   ) {
    sendApproveConnectionRequestMail(
    input: {
      accessToken: $accessToken
      connectionApproveRequestInput: {
        childFullName: $childFullName
        childUserId: $childUserId
        connectionRequestId: $connectionRequestId
        parentFullName:  $parentFullName
        parentUserId: $parentUserId
        requestorNpi: $requestorNpi
        targetNpi: $targetNpi
        ipAddressV4: $ipAddressV4
        ipAddressV6: $ipAddressV6
        device:$device
        channel:$channel
        geoLocation: $geoLocation
      }
    }
  ) {
    connectionUpdateResponse {
      data
      error
      message
      status
    }
  }
}
`,
submitRejectConnectionRequest: gql`
mutation submitRejectConnectionRequest (
      $accessToken: String!,
      $connectionRequestId: Int,
      $rejectReason: String,
      $ipAddressV4:String,
      $ipAddressV6:String,
      $device:String,
      $channel:String,
      $geoLocation:String,
   ) {
    submitRejectConnectionRequest(
    input: {
      accessToken: $accessToken
      connectionRejectRequestInput: {
        connectionRequestId: $connectionRequestId
        rejectReason: $rejectReason
        ipAddressV4: $ipAddressV4
        ipAddressV6: $ipAddressV6        
        device:$device
        channel:$channel
        geoLocation: $geoLocation
      }
    }
  ) {
    connectionUpdateResponse {
      data
      error
      message
      status
    }
  }
}
`,
sendRejectConnectionRequestMail: gql`
mutation sendRejectConnectionRequestMail (
      $accessToken: String!,
      $connectionRequestId: Int,
      $rejectReason: String,
      $ipAddressV4:String,
      $ipAddressV6:String,
      $device:String,
      $channel:String,
      $geoLocation:String,
   ) {
    sendRejectConnectionRequestMail(
    input: {
      accessToken: $accessToken
      connectionRejectRequestInput: {
        connectionRequestId: $connectionRequestId
        rejectReason: $rejectReason
        ipAddressV4: $ipAddressV4
        ipAddressV6: $ipAddressV6        
        device:$device
        channel:$channel
        geoLocation: $geoLocation
      }
    }
  ) {
    connectionUpdateResponse {
      data
      error
      message
      status
    }
  }
}
`,
submitCancelConnection: gql`
mutation submitCancelConnection (
      $accessToken: String!,
      $targetUserId: String,
      $parentUserId: String,
      $ipAddressV4:String,
	    $ipAddressV6:String,      
      $device:String,
      $channel:String,
      $geoLocation:String
   ) {
    submitCancelConnection(
    input: {
        accessToken: $accessToken
        targetUserId: $targetUserId
        parentUserId: $parentUserId
        ipAddressV4: $ipAddressV4
        ipAddressV6: $ipAddressV6        
        device:$device
        channel:$channel
        geoLocation: $geoLocation
    }
  ) {
    connectionUpdateResponse {
      data
      error
      message
      status
    }
  }
}
`,
updateNotificationStatus: gql`
mutation updateNotificationStatus (
  $accessToken: String!,
  $pocnUserId: String,
  )
  {
    updateNotificationStatus(
    input: {accessToken: $accessToken, pocnUserId: $pocnUserId}
    ){
      updateResponse {
        data
        error
        message
        status
      }
    }
  }
`,
submitRemoveRecommendedConnection: gql`
mutation submitRemoveRecommendedConnection (
      $accessToken: String!,
      $requestorFullName: String,
      $requestorNpi: String,
      $targetNpi: String,
      $targetFullName: String,
   ) {
    submitRemoveRecommendedConnection(
    input: {
      accessToken: $accessToken
      removeRequestInput:{
        requestorFullName: $requestorFullName
        requestorNpi: $requestorNpi
        targetNpi: $targetNpi
        targetFullName: $targetFullName
      }
    })


   {
    connectionUpdateResponse {
      data
      error
      message
      status
    }
  }
}
`,
createFollower: gql`
mutation createFollower (
  $accessToken: String!,
  $followingUserId: String,
  $pocnUserId: String,
  $ipAddressV4:String,
	$ipAddressV6:String,  
  $device:String,
  $channel:String,
  $geoLocation:String
   ) {
    createFollower(
    input: {
      accessToken: $accessToken
        followingUserId: $followingUserId
        pocnUserId: $pocnUserId
        ipAddressV4: $ipAddressV4
        ipAddressV6: $ipAddressV6          
        device:$device
        channel:$channel
        geoLocation: $geoLocation

    })
   {
    createResponse  {
      data
      error
      message
      status
    }
  }
}
`,
unfollowUser: gql`
mutation unfollowUser (
  $accessToken: String!,
  $followingUserId: String,
  $pocnUserId: String,
  $ipAddressV4:String,
	$ipAddressV6:String,  
  $device:String,
  $channel:String,
  $geoLocation:String,
   ) {
    unfollowUser(
    input: {
      accessToken: $accessToken
        followingUserId: $followingUserId
        pocnUserId: $pocnUserId
        ipAddressV4: $ipAddressV4
        ipAddressV6: $ipAddressV6  
        device:$device
        channel:$channel
        geoLocation: $geoLocation

    })
   {
    createResponse  {
      data
      error
      message
      status
    }
  }
}
`,
addCallerProfile: gql`
mutation addCallerProfile (
  $accessToken: String!,
  $name: String,
  $npi: String,
  $phoneNumber: String,
  $providerId: Int,
  $userId: String,
  $callerUuid: String
   ) {
    addCallerProfile(
    input: {
      accessToken: $accessToken
      callerUuid:  $callerUuid
      callerProfileInput: {
        userId: $userId
        npi: $npi
        providerId: $providerId
        name: $name
        phoneNumber: $phoneNumber
      }
    }
  ) {
    userProfileUpdateResponse {
      status
      error
      message
      data
    }
  }
}
`,
submitBaaSign: gql`
mutation submitBaaSign (
  $accessToken: String!,
  $baaStarted: Boolean,
  $channel: String,
  $device:String,
  $geoLocation:String,
  $ipAddressV4:String,
	$ipAddressV6:String,  
  $signatureContent: String,
   ) {
    submitBaaSign(
    input: {
      accessToken: $accessToken
      stageRequestInput: {
        baaStarted: $baaStarted
        channel: $channel
        device: $device
        geoLocation: $geoLocation
        ipAddressV4: $ipAddressV4
        ipAddressV6: $ipAddressV6        
        signatureContent: $signatureContent
      }
    }
  ) {
    updateConnectionResponse {
      status
      error
      message
      data
    }
  }
}
`,
sendBaaEmail: gql`
mutation sendBaaEmail (
  $accessToken: String!,
  $baaStarted: Boolean,
  $channel: String,
  $device:String,
  $geoLocation:String,
  $ipAddressV4:String,
	$ipAddressV6:String,  
  $signatureContent: String,
   ) {
    sendBaaEmail(
    input: {
      accessToken: $accessToken
      stageRequestInput: {
        baaStarted: $baaStarted
        channel: $channel
        device: $device
        geoLocation: $geoLocation
        ipAddressV4: $ipAddressV4
	      ipAddressV6: $ipAddressV6        
        signatureContent: $signatureContent
      }
    }
  ) {
    updateConnectionResponse {
      status
      error
      message
      data
    }
  }
}
`,
submitEmailVerification: gql`
mutation submitEmailVerification (
  $accessToken: String!,
  $channel: String,
  $ipAddressV4:String,
	$ipAddressV6:String,  
  $device: String,
  $geoLocation: String,
  $emailToken: String,

   ) {
    submitEmailVerification(
    input: {
      accessToken: $accessToken
      channel: $channel
      ipAddressV4: $ipAddressV4
      ipAddressV6: $ipAddressV6      
      device: $device
      geoLocation: $geoLocation
      emailToken: $emailToken
    }
  ) {
    updateConnectionResponse {
      data
      error
      message
      status
    }
  }
}
`,
submitEmailConfirm: gql`
mutation submitEmailConfirm (
  $accessToken: String!,
  $channel: String,
  $device: String,
  $geoLocation: String,
  $ipAddressV4:String,
	$ipAddressV6:String,  
  $workEmailId: String,
   ) {
    submitEmailConfirm(
    input: {
      accessToken: $accessToken
      channel: $channel
      device: $device
      geoLocation: $geoLocation
      ipAddressV4: $ipAddressV4
      ipAddressV6: $ipAddressV6      
      workEmailId: $workEmailId
    }
  ) {
    updateConnectionResponse {
      data
      error
      message
      status
    }
  }
}
`,
resendVerificationCode: gql`
mutation resendVerificationCode (
  $accessToken: String!,
  $channel:String,
  $device:String,
  $emailId:String,
  $geoLocation:String,
  $ipAddressV4:String,
	$ipAddressV6:String,
  ) {
    resendVerificationCode(
    input: {
      accessToken: $accessToken,
      channel: $channel
      device: $device
      geoLocation: $geoLocation
      emailId: $emailId
      ipAddressV4: $ipAddressV4
	    ipAddressV6: $ipAddressV6
    }
  ) {
    updateConnectionResponse {
      data
      error
      message
      status
    }
  }
}
`,
submitHcpVerificationConsent: gql`
mutation submitHcpVerificationConsent (
  $accessToken: String!,
  $channel: String,
  $device: String,
  $geoLocation: String,
  $ipAddressV4:String,
	$ipAddressV6:String,
   ) {
    submitHcpVerificationConsent(
    input: {
      accessToken: $accessToken
      channel: $channel
      device: $device
      geoLocation: $geoLocation
      ipAddressV4: $ipAddressV4
	    ipAddressV6: $ipAddressV6
    }
  ) {
    updateConnectionResponse {
      data
      error
      message
      status
    }
  }
}
`,
submitHcpElectronicVerification: gql`
mutation submitHcpElectronicVerification (
  $accessToken: String!,
  $channel: String,
  $device: String,
  $geoLocation: String,
  $ipAddressV4:String,
	$ipAddressV6:String,
   ) {
    submitHcpElectronicVerification(
    input: {
      accessToken: $accessToken
      channel: $channel
      device: $device
      geoLocation: $geoLocation
      ipAddressV4: $ipAddressV4
	    ipAddressV6: $ipAddressV6
    }
  ) {
    updateConnectionResponse {
      data
      error
      message
      status
    }
  }
}
`,
submitUploadHcp: gql`
mutation submitUploadHcp (
  $accessToken: String!,
  $channel: String,
  $device: String,
  $fileContent: String,
  $fileName: String,
  $fileType: String,
  $fileSize: String,
  $geoLocation: String,
  $ipAddressV4:String,
	$ipAddressV6:String,
  $type: String,
   ) {
    submitUploadHcp(
    input: {
      uploadRequestInput: {
        channel: $channel
        device: $device
        fileContent: $fileContent
        fileName: $fileName
        fileType: $fileType
        fileSize: $fileSize
        geoLocation: $geoLocation
        ipAddressV4: $ipAddressV4
	      ipAddressV6: $ipAddressV6
        type: $type
      }
      accessToken: $accessToken
    }
  ) {
    updateConnectionResponse{
      status
      error
      message
      data
    }
  }
}
`,
sendManualUploadVerificationEmail: gql`
mutation sendManualUploadVerificationEmail (
  $accessToken: String!,
  $channel: String,
  $device: String,
  $fileContent: String,
  $fileName: String,
  $fileType: String,
  $fileSize: String,
  $geoLocation: String,
  $ipAddressV4:String,
	$ipAddressV6:String,
  $type: String,
   ) {
    sendManualUploadVerificationEmail(
    input: {
      uploadRequestInput: {
        channel: $channel
        device: $device
        fileContent: $fileContent
        fileName: $fileName
        fileType: $fileType
        fileSize: $fileSize
        geoLocation: $geoLocation
        ipAddressV4: $ipAddressV4
	      ipAddressV6: $ipAddressV6
        type: $type
      }
      accessToken: $accessToken
    }
  ) {
    updateConnectionResponse{
      status
      error
      message
      data
    }
  }
}
`,

submitPhoneLinking: gql`
mutation submitPhoneLinking (
  $accessToken: String!,
  $channel: String,
  $countryCode: String,
  $device: String,
  $geoLocation: String,
  $ipAddressV4:String,
	$ipAddressV6:String,
  $phoneNumber: String,
   ) {
    submitPhoneLinking(
    input: {
      accessToken: $accessToken
      channel: $channel
      countryCode: $countryCode
      device: $device
      geoLocation: $geoLocation
      ipAddressV4: $ipAddressV4
	    ipAddressV6: $ipAddressV6
      phoneNumber: $phoneNumber
    }
  ) {
    updateConnectionResponse {
      data
      error
      message
      status
    }
  }
}
`,
updatePatientConnectStatus: gql`
mutation updatePatientConnectStatus (
  $accessToken: String!,
  $channel: String!,
  $device: String!,
  $geoLocation: String!,
  $ipAddressV4:String,
	$ipAddressV6:String,
   ) {
    updatePatientConnectStatus(
    input: {
      accessToken: $accessToken
      channel: $channel
      device: $device
      geoLocation: $geoLocation
      ipAddressV4: $ipAddressV4
	    ipAddressV6: $ipAddressV6
    }
  ) {
    updateConnectionResponse {
      data
      error
      message
      status
    }
  }
}
`,
createGroup: gql`
mutation createGroup (
  $accessToken: String!,
  $groupInput: GroupCreateInputRecordInput,
  ) {
    createGroup(
    input: {
      accessToken: $accessToken
      groupInput: $groupInput
    }
  ) {
    groupStatusResponse {
      data
      error
      message
      status
    }
  }
}
`,
joinGroup: gql`
mutation joinGroup (
  $groupInput: JoinGroupInputRecordInput,
  $accessToken: String!,
  ) {
    joinGroup(
    input: {
      accessToken: $accessToken
      joinGroupInput: $groupInput
    }
  ) {
    groupStatusResponse {
      data
      error
      message
      status
    }
  }
}
`,
withdrawGroupJoinRequest: gql`
mutation withdrawGroupJoinRequest (
      $accessToken: String!,
      $groupId: String,
      $type: String,
      $ipAddressV4:String
	    $ipAddressV6:String
      $device:String
      $channel:String
      $geoLocation:String
   ) {
    withdrawGroupJoinRequest(
    input: {
      accessToken: $accessToken
      groupId: $groupId
      type: $type
      ipAddressV4: $ipAddressV4
      ipAddressV6: $ipAddressV6
      device:$device
      channel:$channel
      geoLocation: $geoLocation
    })
    {
    groupStatusResponse {
      data
      error
      message
      status
    }
  }
}
`,
withdrawConnectionRequest: gql`
mutation withdrawConnectionRequest (
      $accessToken: String!
      $targetNpi: String
      $ipAddressV4:String,
	    $ipAddressV6:String,
      $device:String
      $channel:String
      $geoLocation:String
   ) {
    withdrawConnectionRequest(
    input: {
      accessToken: $accessToken
        targetNpi: $targetNpi
        ipAddressV4: $ipAddressV4
	      ipAddressV6: $ipAddressV6
        device:$device
        channel:$channel
        geoLocation: $geoLocation
    })
    {
    connectionUpdateResponse {
      data
      error
      message
      status
    }
  }
}
`,
updateCallerContactPhone: gql`
mutation updateCallerContactPhone (
  $accessToken: String!,
  $channel: String,
  $countryCode: String,
  $device: String,
  $geoLocation: String,
  $ipAddressV4:String,
	$ipAddressV6:String,
  $phoneNumber: String,
  ) {
    updateCallerContactPhone(
    input: {
      accessToken: $accessToken
      channel: $channel
      countryCode: $countryCode
      device: $device
      geoLocation: $geoLocation
      ipAddressV4: $ipAddressV4
	    ipAddressV6: $ipAddressV6
      phoneNumber: $phoneNumber
    }
  ) {
    updateConnectionResponse {
      data
      error
      message
      status
    }
  }
}
`,
updateCallerContactEmail: gql`
mutation updateCallerContactEmail (
  $accessToken: String!,
  $channel: String,
  $device: String,
  $emailToken: String,
  $emailId: String,
  $geoLocation: String,
  $ipAddressV4:String,
	$ipAddressV6:String,
  ) {
    updateCallerContactEmail(
    input: {
      accessToken: $accessToken
      channel: $channel
      device: $device
      emailToken: $emailToken
      emailId: $emailId
      geoLocation: $geoLocation
      ipAddressV4: $ipAddressV4
	    ipAddressV6: $ipAddressV6
    }
  ) {
    updateConnectionResponse {
      data
      error
      message
      status
    }
  }
}
`,
removeCallerId: gql`
mutation removeCallerId (
  $accessToken: String!,
  $channel: String,
  $device: String,
  $geoLocation: String,
  $ipAddressV4:String,
	$ipAddressV6:String,
  $removeId: String,
  ) {
    removeCallerId(
    input: {
      accessToken: $accessToken
      channel: $channel
      device: $device
      geoLocation: $geoLocation
      ipAddressV4: $ipAddressV4
	    ipAddressV6: $ipAddressV6
      removeId: $removeId
    }
  ) {
    updateConnectionResponse {
      data
      error
      message
      status
    }
  }
}
`,
approveGroupJoinRequest: gql`
mutation approveRequest (
  $accessToken: String!,
  $actionType: String!,
  $groupId: String!,
  $requestedUserId: String!,
  $channel: String,
  $device: String,
  $geoLocation: String,
  $ipAddressV4:String,
  $ipAddressV6:String,
  ) {
    approveRequest(
    input: {
      accessToken: $accessToken
      approveGroupInput: {
      actionType: $actionType
      groupId: $groupId
      requestedUserId: $requestedUserId,
      channel: $channel
      device: $device
      geoLocation: $geoLocation
      ipAddressV4: $ipAddressV4
	    ipAddressV6: $ipAddressV6
      }
    }
  ) {
    groupStatusResponse {
      data
      error
      message
      status
    }
  }
}
`,
deleteGroup: gql`
mutation deleteGroup (
  $accessToken: String!,
  $groupId: String!,
  )
  {
    deleteGroup(
    input: {
      accessToken: $accessToken
      groupId: $groupId
    })
    {
    groupStatusResponse {
      data
      error
      message
      status
    }
  }
}
`,
updateGroup: gql`
mutation updateGroup (
  $accessToken: String!,
  $groupId: String!,
  $groupInput: GroupCreateInputRecordInput,
  )
  {
    updateGroup(
      input: {
        accessToken: $accessToken
        groupUuid: $groupId
        groupInput: $groupInput
      }
    )
    {
    groupStatusResponse {
      data
      error
      message
      status
    }
  }
}
`,
sendParticipantEmail: gql`
mutation sendParticipantEmail (
  $accessToken: String!,
  $callUrl: String,
  $channel: String,
  $device: String,
  $geoLocation: String,
  $ipAddressV4:String,
	$ipAddressV6:String,
  $participantEmail: String
   ) {
    sendParticipantEmail(
    input: {
      accessToken: $accessToken
      callUrl: $callUrl
      channel: $channel
      device: $device
      geoLocation: $geoLocation
      ipAddressV4: $ipAddressV4
ipAddressV6: $ipAddressV6
      participantEmail: $participantEmail
    }
  ) {
    updateConnectionResponse {
      data
      error
      message
      status
    }
  }
}
`,
createRoom: gql`
mutation createRoom (
  $accessToken: String!,
  $channel: String,
  $device: String,
  $geoLocation: String,
  $ipAddressV4:String,
	$ipAddressV6:String,
   ) {
    createRoom(
    input: {
      accessToken: $accessToken
      channel: $channel
      device: $device
      geoLocation: $geoLocation
      ipAddressV4: $ipAddressV4
ipAddressV6: $ipAddressV6
    }
  ) {
    updateConnectionResponse {
      data
      error
      message
      status
    }
  }
}
`,
addParticipant: gql`
mutation addParticipant (
  $accessToken: String!,
  $roomId:String,
  $participantContact:String,
  $channel:String,
  $device:String,
  $geoLocation:String,
  $ipAddressV4:String,
	$ipAddressV6:String,
   ) {
    addParticipant(
    input: {
      accessToken: $accessToken
      roomId: $roomId
      participantContact: $participantContact
      channel: $channel
      device: $device
      geoLocation: $geoLocation
      ipAddressV4: $ipAddressV4
ipAddressV6: $ipAddressV6
    }
  ) {
    updateConnectionResponse {
      data
      error
      message
      status
    }
  }
}
`,
deleteChatRoom: gql`
mutation deleteChatRoom (
  $accessToken: String!,
  $channel: String,
  $device: String,
  $geoLocation: String,
  $ipAddressV4:String,
	$ipAddressV6:String,
  $roomId:String,
   ) {
    deleteChatRoom(
    input: {
      accessToken: $accessToken
      channel: $channel
      device: $device
      geoLocation: $geoLocation
      ipAddressV4: $ipAddressV4
ipAddressV6: $ipAddressV6
      roomId: $roomId
    }
  ) {
    updateConnectionResponse {
      data
      error
      message
      status
    }
  }
}
`,
validatePhoneNumber: gql`
mutation validatePhoneNumber (
  $accessToken: String!,
  $phoneNumber:String,
   ) {
    validatePhoneNumber(
    input: {
      accessToken: $accessToken
      phoneNumber: $phoneNumber
    }
  ) {
    updateConnectionResponse {
      data
      error
      message
      status
    }
  }
}
`,
validateWorkEmail: gql`
mutation validateWorkEmail (
  $accessToken: String!,
  $workEmail:String,
   ) {
    validateWorkEmail(
    input: {
      accessToken: $accessToken
      workEmail: $workEmail
    }
  ) {
    updateConnectionResponse {
      data
      error
      message
      status
    }
  }
}
`,
createPost: gql`
mutation createPost (
  $accessToken: String,
    $channel: String,
    $class: String,
    $ipAddressV4:String,
	  $ipAddressV6:String,
    $postType: Int
    $postTypeContent: String,
    $postContent: String,
    $postTags: String,
    $postTitle: String,
    $parentPost: String,
    $postExtension: String,
    $postFileType:String,
    $audienceType:String,
    $groupId: String) {
    createPost(
    input: {
      accessToken: $accessToken,
      groupId:  $groupId
      postInput: {
        channel: $channel,
        class: $class,
        ipAddressV4: $ipAddressV4
ipAddressV6: $ipAddressV6,
        postType: $postType,
        postTypeContent: $postTypeContent,
        postContent: $postContent,
        postTags: $postTags,
        postTitle: $postTitle,
        parentPost: $parentPost,
        postExtension: $postExtension,
        postFileType: $postFileType,
        audienceType:$audienceType
      }
    }
  ) {
    postStatusResponse  {
      data
      error
      message
      status

    }
  }
}
`,
updateUserFirstName: gql`
mutation updateUserFirstName (
  $accessToken: String!,
  $firstName:String,
   ) {
    updateUserFirstName(
    input: {
      accessToken: $accessToken
      firstName: $firstName
    }
  ) {
    userProfileUpdateResponse {
      data
      error
      message
      status
    }
  }
}
`,
updateUserLastName: gql`
mutation updateUserLastName (
  $accessToken: String!,
  $lastName:String,
   ) {
    updateUserLastName(
    input: {
      accessToken: $accessToken
      lastName: $lastName
    }
  ) {
    userProfileUpdateResponse {
      data
      error
      message
      status
    }
  }
}
`,
updateUserState: gql`
mutation updateUserState (
  $accessToken: String!,
  $state:String,
   ) {
    updateUserState(
    input: {
      accessToken: $accessToken
      state: $state
    }
  ) {
    userProfileUpdateResponse {
      data
      error
      message
      status
    }
  }
}
`,
updateUserCity: gql`
mutation updateUserCity (
  $accessToken: String!,
  $city:String,
   ) {
    updateUserCity(
    input: {
      accessToken: $accessToken
      city: $city
    }
  ) {
    userProfileUpdateResponse {
      data
      error
      message
      status
    }
  }
}
`,
updateUserDegreeCodeText: gql`
mutation updateUserDegreeCodeText (
  $accessToken: String!,
  $degreeCodeText:String,
   ) {
    updateUserDegreeCodeText(
    input: {
      accessToken: $accessToken
      degreeCodeText: $degreeCodeText
    }
  ) {
    userProfileUpdateResponse {
      data
      error
      message
      status
    }
  }
}
`,
updateUserZip: gql`
mutation updateUserZip (
  $accessToken: String!,
  $zip:String,
   ) {
    updateUserZip(
    input: {
      accessToken: $accessToken
      zip: $zip
    }
  ) {
    userProfileUpdateResponse {
      data
      error
      message
      status
    }
  }
}
`,
updateUserFax: gql`
mutation updateUserFax (
  $accessToken: String!,
  $fax:String,
   ) {
    updateUserFax(
    input: {
      accessToken: $accessToken
      fax: $fax
    }
  ) {
    userProfileUpdateResponse {
      data
      error
      message
      status
    }
  }
}
`,
updateUserPhoneNumber: gql`
mutation updateUserPhoneNumber (
  $accessToken: String!,
  $phoneNumber:String,
   ) {
    updateUserPhoneNumber(
    input: {
      accessToken: $accessToken
      phoneNumber: $phoneNumber
    }
  ) {
    userProfileUpdateResponse {
      data
      error
      message
      status
    }
  }
}
`,
updateUserMobileNumber: gql`
mutation updateUserMobileNumber (
  $accessToken: String!,
  $mobileNumber:String,
   ) {
    updateUserMobileNumber(
    input: {
      accessToken: $accessToken
      mobileNumber: $mobileNumber
    }
  ) {
    userProfileUpdateResponse {
      data
      error
      message
      status
    }
  }
}
`,
updateUserTagline: gql`
mutation updateUserTagline (
  $accessToken: String!,
  $profileTagLine:String,
   ) {
    updateUserTagline(
    input: {
      accessToken: $accessToken
      profileTagLine: $profileTagLine
    }
  ) {
    userProfileUpdateResponse {
      data
      error
      message
      status
    }
  }
}
`,
sharePost: gql`
mutation sharePost (
  $accessToken: String,
    $typeItemId: [String],
    $postId: String,
    $ipAddressV4:String,
	  $ipAddressV6:String,
    $geoLocation: String
    $device: String,
    $class: String,
    $channel: String,
    $audienceType: String) {
    sharePost(
    input: {
      accessToken: $accessToken
      postInput: {
        typeItemId: $typeItemId,
        postId: $postId,
        ipAddressV4: $ipAddressV4
ipAddressV6: $ipAddressV6,
        geoLocation: $geoLocation,
        device: $device,
        class: $class,
        channel: $channel,
        audienceType: $audienceType
      }
    }
  ) {
    postStatusResponse  {
      data
      error
      message
      status
    }
  }
}
`,
updateUserPrimarySpecialty: gql`
mutation updateUserPrimarySpecialty (
  $accessToken: String!,
  $specialtyCode:String,
  $specialtyDesc:String,
  $specialtyGroup:String,
  $specialtyGroupCode:String
   ) {
    updateUserPrimarySpecialty(
    input: {
      accessToken: $accessToken
      specialtyCode: $specialtyCode
      specialtyDesc: $specialtyDesc
      specialtyGroup: $specialtyGroup
      specialtyGroupCode: $specialtyGroupCode
    }
  ) {
    userProfileUpdateResponse {
      data
      error
      message
      status
    }
  }
}
`,
submitCallerId: gql`
mutation sharePost (
  $accessToken: String,
  $ipAddressV4:String,
	$ipAddressV6:String,    
  $geoLocation: String
    $device: String,
    $channel: String,
    ) {
      submitCallerId(
    input: {
      accessToken: $accessToken
      ipAddressV4: $ipAddressV4
      ipAddressV6: $ipAddressV6,
      geoLocation: $geoLocation,
      device: $device,
      channel: $channel,
    }
  ) {
    updateConnectionResponse  {
      data
      error
      message
      status
    }
  }
}
`,
deletePost: gql`
mutation deletePost (
  $accessToken: String,
  $postId: String,
  $ipAddressV4:String,
	$ipAddressV6:String,
  $geoLocation: String
  $device: String,
  $channel: String,
   ) {
    deletePost(
    input: {
      accessToken: $accessToken
      postId: $postId,
      ipAddressV4: $ipAddressV4
ipAddressV6: $ipAddressV6,
      geoLocation: $geoLocation,
      device: $device,
      channel: $channel,
    }
  ) {
    postStatusResponse  {
      data
      error
      message
      status
    }
  }
}
`,
updateUserLinkedin: gql`
mutation updateUserLinkedin (
  $accessToken: String!,
  $linkedinUrl:String,
   ) {
    updateUserLinkedin(
    input: {
      accessToken: $accessToken
      linkedinUrl: $linkedinUrl
    }
  ) {
    userProfileUpdateResponse {
      data
      error
      message
      status
    }
  }
}
`,
updateUserFbProfile: gql`
mutation updateUserFbProfile (
  $accessToken: String!,
  $fbUrl:String,
   ) {
    updateUserFbProfile(
    input: {
      accessToken: $accessToken
      fbUrl: $fbUrl
    }
  ) {
    userProfileUpdateResponse {
      data
      error
      message
      status
    }
  }
}
`,
updateUserTwitterProfile: gql`
mutation updateUserTwitterProfile (
  $accessToken: String!,
  $twitterUrl:String,
   ) {
    updateUserTwitterProfile(
    input: {
      accessToken: $accessToken
      twitterUrl: $twitterUrl
    }
  ) {
    userProfileUpdateResponse {
      data
      error
      message
      status
    }
  }
}
`,
updateUserWebsite: gql`
mutation updateUserWebsite (
  $accessToken: String!,
  $websiteUrl:String,
   ) {
    updateUserWebsite(
    input: {
      accessToken: $accessToken
      websiteUrl: $websiteUrl
    }
  ) {
    userProfileUpdateResponse {
      data
      error
      message
      status
    }
  }
}
`,
likePost: gql`
mutation likePost (
  $accessToken: String,
  $postId: String,
  $ipAddressV4:String,
	$ipAddressV6:String,
  $geoLocation: String
  $device: String,
  $channel: String,
   ) {
    likePost(
    input: {
      accessToken: $accessToken
      postId: $postId,
      ipAddressV4: $ipAddressV4
ipAddressV6: $ipAddressV6,
      geoLocation: $geoLocation,
      device: $device,
      channel: $channel,
    }
  ) {
    postStatusLikeResponse  {
      likeStatus
      totalCount
      error
      message
      status
    }
  }
}
`,
searchPost: gql`
mutation searchPost (
  $accessToken: String,
  $searchText: String,
   ) {
    searchPost(
    input: {
      accessToken: $accessToken
      searchText: $searchText
    }
  ) {
    postSearchResponse {
      error
      message
      status
      postLikes {
        description
        fullName
        likeCount
        postAttachment
        postDate
        postId
        postStatus
        profileImage
        providerType
        specialty
        userId
      }
    }
  }
}
`,
// submitUserConnectionRequest: gql`
// mutation submitUserConnectionRequest (
//       $accessToken: String!,
//       $targetUserId: String!,
//       $targetUserFullName: String,
//       $targetUserFirstName: String,
//       $targetUserLastName: String,
//       $targetUserEmailId: String,
//       $statusUpdateDate: String,
//       $source: String,
//       $requestorUserId: String,
//       $requestorUserFullName: String,
//       $rejectReason: String,
//       $requestorNpi: String,
//       $connectionStatus: String,
//       $connectionMessage: String,
//       $agingDays: String,
//       $ipAddress:String,
//       $device:String,
//       $channel:String,
//       $geoLocation:String
//    ) {
//     submitUserConnectionRequest(
//     input: {
//       accessToken: $accessToken
//       connectionRequestInput: {
//         targetUserId: $targetUserId
//         targetUserFullName: $targetUserFullName
//         targetUserFirstName: $targetUserFirstName
//         targetUserLastName: $targetUserLastName
//         targetUserEmailId: $targetUserEmailId
//         statusUpdateDate: $statusUpdateDate
//         source: $source
//         requestorUserId: $requestorUserId
//         requestorUserFullName:  $requestorUserFullName
//         rejectReason: $rejectReason
//         requestorNpi:$requestorNpi
//         connectionStatus: $connectionStatus
//         connectionMessage: $connectionMessage
//         agingDays: $agingDays
//         ipAddress:$ipAddress
//         device:$device
//         channel:$channel
//         geoLocation: $geoLocation
//       }
//     }
//   ) {
//     connectionUpdateResponse {
//       status
//       error
//       message
//     }
//   }
// }
// `,

submitUserConnectionRequest: gql`
mutation submitUserConnectionRequest (
        $accessToken: String!,
        $targetUserId: String!,
        $targetUserFullName: String,
        $targetUserFirstName: String,
        $targetUserLastName: String,
        $targetUserEmailId: String,
        $statusUpdateDate: String,
        $source: String,
        $requestorUserId: String,
        $requestorUserFullName: String,
        $rejectReason: String,
        $requestorNpi: String,
        $connectionStatus: String,
        $connectionMessage: String,
        $agingDays: String,
        $ipAddressV4:String,
	      $ipAddressV6:String,
        $device:String,
        $channel:String,
        $geoLocation:String,
        $targetHcpDegreeCode: String,
        $targetHcpDegreeGroupCode: String,
        $targetPrimarySpecialtyName: String,
        $targetUserCity: String,
        $targetUserState: String,
        $domain : String,
   ) {
    submitUserConnectionRequest(
    input: {
      accessToken: $accessToken
      connectionRequestInput: {
        agingDays: $agingDays
        channel: $channel
        connectionMessage: $connectionMessage
        connectionStatus:$connectionStatus
        device: $device
        geoLocation:$geoLocation
        ipAddressV4: $ipAddressV4
ipAddressV6: $ipAddressV6
        rejectReason: $rejectReason
        requestorNpi: $requestorNpi
        requestorUserFullName: $requestorUserFullName
        requestorUserId:  $requestorUserId
        source: $source
        statusUpdateDate: $statusUpdateDate
        targetUserEmailId:  $targetUserEmailId
        targetUserFirstName: $targetUserFirstName
        targetUserId: $targetUserId
        targetUserFullName: $targetUserFullName
        targetUserLastName: $targetUserLastName
        targetHcpDegreeCode: $targetHcpDegreeCode
        targetHcpDegreeGroupCode: $targetHcpDegreeGroupCode
        targetPrimarySpecialtyName: $targetPrimarySpecialtyName
        targetUserCity: $targetUserCity
        targetUserState: $targetUserState
      }
      domain : $domain
    }
  ) {
    connectionUpdateResponse {
      data
      error
      message
      status
    }
  }
}
`,
sendConnectionRequestMail: gql`
mutation sendConnectionRequestMail (
        $accessToken: String!,
        $targetUserId: String!,
        $targetUserFullName: String,
        $targetUserFirstName: String,
        $targetUserLastName: String,
        $targetUserEmailId: String,
        $statusUpdateDate: String,
        $source: String,
        $requestorUserId: String,
        $requestorUserFullName: String,
        $rejectReason: String,
        $requestorNpi: String,
        $connectionStatus: String,
        $connectionMessage: String,
        $agingDays: String,
        $ipAddressV4:String,
	      $ipAddressV6:String,
        $device:String,
        $channel:String,
        $geoLocation:String,
        $targetHcpDegreeCode: String,
        $targetHcpDegreeGroupCode: String,
        $targetPrimarySpecialtyName: String,
        $targetUserCity: String,
        $targetUserState: String,
        $domain : String,
   ) {
    sendConnectionRequestMail(
    input: {
      accessToken: $accessToken
      connectionRequestInput: {
        agingDays: $agingDays
        channel: $channel
        connectionMessage: $connectionMessage
        connectionStatus:$connectionStatus
        device: $device
        geoLocation:$geoLocation
        ipAddressV4: $ipAddressV4
ipAddressV6: $ipAddressV6
        rejectReason: $rejectReason
        requestorNpi: $requestorNpi
        requestorUserFullName: $requestorUserFullName
        requestorUserId:  $requestorUserId
        source: $source
        statusUpdateDate: $statusUpdateDate
        targetUserEmailId:  $targetUserEmailId
        targetUserFirstName: $targetUserFirstName
        targetUserId: $targetUserId
        targetUserFullName: $targetUserFullName
        targetUserLastName: $targetUserLastName
        targetHcpDegreeCode: $targetHcpDegreeCode
        targetHcpDegreeGroupCode: $targetHcpDegreeGroupCode
        targetPrimarySpecialtyName: $targetPrimarySpecialtyName
        targetUserCity: $targetUserCity
        targetUserState: $targetUserState
      }
      domain : $domain
    }
  ) {
    connectionUpdateResponse {
      data
      error
      message
      status
    }
  }
}
`,
makeGroupAdmin: gql`
mutation makeGroupAdmin (
  $accessToken: String,
  $groupUuid: String,
  $memberUserId: String,
   ) {
    makeGroupAdmin(
    input: {
      accessToken: $accessToken
      groupUuid: $groupUuid
      memberUserId: $memberUserId
    }
  ) {
    groupStatusResponse {
      error
      data
      message
      status
    }
  }
}
`,
removeGroupAdmin: gql`
mutation removeGroupAdmin (
  $accessToken: String,
  $groupUuid: String,
  $memberUserId: String,
   ) {
    removeGroupAdmin(
    input: {
      accessToken: $accessToken
      groupUuid: $groupUuid
      memberUserId: $memberUserId
    }
  ) {
    groupStatusResponse {
      error
      data
      message
      status
    }
  }
}
`,
inviteUserGroup: gql`
mutation inviteUserGroup (
  $accessToken: String,
  $groupId: String,
  $userId: String,
  $npi: String,
  $userFirstName: String,
  $userLastName: String,
  $userSpecialtyCode: String,
  $userSpecialtyDesc: String,
  $userDegreeGroupCode: String,
  $userCity: String,
  $userState: String,
  $ipAddressV4:String,
	$ipAddressV6:String,
  $device: String,
  $channel: String,
  $inviteUserClass: String,
  $geoLocation: String,
  $userEmail: String,
  $userMessage: String
   ) {
    inviteUserGroup(
    input: {
      accessToken: $accessToken
      inviteGroupInput: {
      groupId:  $groupId,
      userId: $userId,
      npi: $npi,
      userFirstName: $userFirstName,
      userLastName:  $userLastName,
      userSpecialtyCode: $userSpecialtyCode,
      userSpecialtyDesc: $userSpecialtyDesc,
      userDegreeGroupCode: $userDegreeGroupCode,
      userCity: $userCity,
      userState: $userState,
      ipAddressV4: $ipAddressV4
ipAddressV6: $ipAddressV6,
      device: $device,
      channel:  $channel,
      inviteUserClass: $inviteUserClass,
      geoLocation: $geoLocation,
      userEmail:  $userEmail,
      userMessage: $userMessage
    }
  }
  ) {
    groupStatusResponse {
      error
      data
      message
      status
    }
  }
}
`,
updateGroupName: gql`
mutation updateGroupName (
  $accessToken: String,
    $groupName: String,
    $channel: String,
    $class: String,
    $device: String,
    $geoLocation: String,
    $ipAddressV4:String,
	  $ipAddressV6:String,
    $groupUuid: String,) {
      updateGroupName(
    input: {
      accessToken: $accessToken
      groupName: $groupName
      groupUpdateLog: {
      channel: $channel,
      class: $class,
      ipAddressV4: $ipAddressV4
ipAddressV6: $ipAddressV6,
      geoLocation: $geoLocation,
      device: $device
      }
      groupUuid: $groupUuid
    }
  ) {
    groupStatusResponse  {
      data
      error
      message
      status

    }
  }
}
`,
updateGroupDescription: gql`
mutation updateGroupDescription (
  $accessToken: String,
    $groupDescription: String,
    $channel: String,
    $class: String,
    $device: String,
    $geoLocation: String,
    $ipAddressV4:String,
	  $ipAddressV6:String,
    $groupUuid: String,) {
      updateGroupDescription(
    input: {
      accessToken: $accessToken
      groupDescription: $groupDescription
      groupUpdateLog: {
      channel: $channel,
      class: $class,
      ipAddressV4: $ipAddressV4
ipAddressV6: $ipAddressV6,
      geoLocation: $geoLocation,
      device: $device
      }
      groupUuid: $groupUuid
    }
  ) {
    groupStatusResponse  {
      data
      error
      message
      status

    }
  }
}
`,
updateGroupTags: gql`
mutation updateGroupTags (
  $accessToken: String,
    $groupTags: String,
    $channel: String,
    $class: String,
    $device: String,
    $geoLocation: String,
    $ipAddressV4:String,
	  $ipAddressV6:String,
    $groupUuid: String,) {
      updateGroupTags(
    input: {
      accessToken: $accessToken
      groupUpdateLog: {
      channel: $channel,
      class: $class,
      ipAddressV4: $ipAddressV4
ipAddressV6: $ipAddressV6,
      geoLocation: $geoLocation,
      device: $device
      }
      groupUuid: $groupUuid
      groupTags: $groupTags
    }
  ) {
    groupStatusResponse  {
      data
      error
      message
      status

    }
  }
}
`,
updateGroupSpecialty: gql`
mutation updateGroupSpecialty (
  $accessToken: String,
    $specialtyCode: String,
    $specialtyText: String,
    $channel: String,
    $class: String,
    $device: String,
    $geoLocation: String,
    $ipAddressV4:String,
	  $ipAddressV6:String,
    $groupUuid: String,) {
      updateGroupSpecialty(
    input: {
      accessToken: $accessToken
      groupUpdateLog: {
      channel: $channel,
      class: $class,
      ipAddressV4: $ipAddressV4
ipAddressV6: $ipAddressV6,
      geoLocation: $geoLocation,
      device: $device
      }
      groupUuid: $groupUuid
      specialtyCode: $specialtyCode
      specialtyText: $specialtyText
    }
  ) {
    groupStatusResponse  {
      data
      error
      message
      status

    }
  }
}
`,
updateGroupEnrollment: gql`
mutation updateGroupEnrollment (
  $accessToken: String,
    $groupEnrollment: String,
    $channel: String,
    $class: String,
    $device: String,
    $geoLocation: String,
    $ipAddressV4:String,
	  $ipAddressV6:String,
    $groupUuid: String,) {
      updateGroupEnrollment(
    input: {
      accessToken: $accessToken
      groupUpdateLog: {
      channel: $channel,
      class: $class,
      ipAddressV4: $ipAddressV4
ipAddressV6: $ipAddressV6,
      geoLocation: $geoLocation,
      device: $device
      }
      groupUuid: $groupUuid
      groupEnrollment: $groupEnrollment
    }
  ) {
    groupStatusResponse  {
      data
      error
      message
      status

    }
  }
}
`,
updateGroupLocation: gql`
mutation updateGroupLocation (
  $accessToken: String,
    $groupLocation: String,
    $channel: String,
    $class: String,
    $device: String,
    $geoLocation: String,
    $ipAddressV4:String,
	  $ipAddressV6:String,
    $groupUuid: String,) {
      updateGroupLocation(
    input: {
      accessToken: $accessToken
      groupUpdateLog: {
      channel: $channel,
      class: $class,
      ipAddressV4: $ipAddressV4
ipAddressV6: $ipAddressV6,
      geoLocation: $geoLocation,
      device: $device
      }
      groupUuid: $groupUuid
      groupLocation: $groupLocation
    }
  ) {
    groupStatusResponse  {
      data
      error
      message
      status

    }
  }
}
`,
updateGroupState: gql`
mutation updateGroupState (
  $accessToken: String,
    $groupState: String,
    $channel: String,
    $class: String,
    $device: String,
    $geoLocation: String,
    $ipAddressV4:String,
	  $ipAddressV6:String,
    $groupUuid: String,) {
      updateGroupState(
    input: {
      accessToken: $accessToken
      groupUpdateLog: {
      channel: $channel,
      class: $class,
      ipAddressV4: $ipAddressV4
ipAddressV6: $ipAddressV6,
      geoLocation: $geoLocation,
      device: $device
      }
      groupUuid: $groupUuid
      groupState: $groupState
    }
  ) {
    groupStatusResponse  {
      data
      error
      message
      status

    }
  }
}
`,
updateGroupTherapeutics: gql`
mutation updateGroupTherapeutics (
  $accessToken: String,
    $therapeuticArea: String,
    $channel: String,
    $class: String,
    $device: String,
    $geoLocation: String,
    $ipAddressV4:String,
	  $ipAddressV6:String,
    $groupUuid: String,) {
      updateGroupTherapeutics(
    input: {
      accessToken: $accessToken
      groupUuid: $groupUuid
      therapeuticArea: $therapeuticArea
      groupUpdateLog: {
      channel: $channel,
      class: $class,
      ipAddressV4: $ipAddressV4
ipAddressV6: $ipAddressV6,
      geoLocation: $geoLocation,
      device: $device
      }
    }
  ) {
    groupStatusResponse  {
      data
      error
      message
      status

    }
  }
}
`,
updateGroupProviderType: gql`
mutation updateGroupProviderType (
  $accessToken: String,
    $groupProviderType: String,
    $channel: String,
    $class: String,
    $device: String,
    $geoLocation: String,
    $ipAddressV4:String,
	  $ipAddressV6:String,
    $groupUuid: String,) {
      updateGroupProviderType(
    input: {
      accessToken: $accessToken
      groupUuid: $groupUuid
      groupUpdateLog: {
      channel: $channel,
      class: $class,
      ipAddressV4: $ipAddressV4
ipAddressV6: $ipAddressV6,
      geoLocation: $geoLocation,
      device: $device
      }
      groupProviderType: $groupProviderType
    }
  ) {
    groupStatusResponse  {
      data
      error
      message
      status

    }
  }
}
`,
acceptInvitationRequest: gql`
mutation acceptInvitationRequest (
  $accessToken: String,
  $groupId: String,
  $invitedUserId: String,
   ) {
    acceptInvitationRequest(
    input: {
      accessToken: $accessToken
      groupId: $groupId
      invitedUserId: $invitedUserId
    }
  ) {
    groupStatusResponse {
      error
      data
      message
      status
    }
  }
}
`,
rejectInvitationRequest: gql`
mutation rejectInvitationRequest (
  $accessToken: String,
  $groupId: String,
  $invitedUserId: String,
   ) {
    rejectInvitationRequest(
    input: {
      accessToken: $accessToken
      groupId: $groupId
      invitedUserId: $invitedUserId
    }
  ) {
    groupStatusResponse {
      error
      data
      message
      status
    }
  }
}
`,
withdrawSentInvitationRequest: gql`
mutation withdrawSentInvitationRequest (
  $accessToken: String,
  $groupId: String,
  $npi: String,
  $userId: String,
   ) {
    withdrawSentInvitationRequest(
    input: {
      accessToken: $accessToken
      groupId: $groupId
      npi: $npi,
      userId: $userId
    }
  ) {
    groupStatusResponse {
      error
      data
      message
      status
    }
  }
}
`,
removeMemberGroup: gql`
mutation removeMemberGroup (
  $accessToken: String,
  $groupId: String,
  $userId: String,
   ) {
    removeMemberGroup(
    input: {
      accessToken: $accessToken
      groupId: $groupId
      userId: $userId
    }
  ) {
    groupStatusResponse {
      error
      data
      message
      status
    }
  }

}
`,
makeGroupOwner: gql`
mutation makeGroupOwner (
  $accessToken: String,
  $groupId: String,
  $userId: String,
  $userFullName: String
   ) {
    makeGroupOwner(
    input: {
      accessToken: $accessToken
      groupId: $groupId
      userId: $userId
      userFullName: $userFullName
    }
  ) {
    groupStatusResponse {
      error
      data
      message
      status
    }
  }
}
`,
updateGroupMemberInvite: gql`
mutation updateGroupMemberInvite (
  $accessToken: String,
    $memberInvite: Int,
    $channel: String,
    $class: String,
    $device: String,
    $geoLocation: String,
    $ipAddressV4:String,
	  $ipAddressV6:String,
    $groupUuid: String,) {
      updateGroupMemberInvite(
    input: {
      accessToken: $accessToken
      groupUuid: $groupUuid
      memberInvite: $memberInvite
      groupUpdateLog: {
      channel: $channel,
      class: $class,
      ipAddressV4: $ipAddressV4
ipAddressV6: $ipAddressV6,
      geoLocation: $geoLocation,
      device: $device
      }
    }
  ) {
    groupStatusResponse  {
      data
      error
      message
      status

    }
  }
}
`,
updateGroupBannerImage: gql`
mutation updateGroupBannerImage (
  $accessToken: String,
    $groupBanner: String,
    $bannerExtension:String,
    $channel: String,
    $class: String,
    $device: String,
    $geoLocation: String,
    $ipAddressV4:String,
	  $ipAddressV6:String,
    $groupUuid: String,) {
      updateGroupBannerImage(
    input: {
      accessToken: $accessToken
      groupUuid: $groupUuid
      groupUpdateLog: {
      channel: $channel,
      class: $class,
      ipAddressV4: $ipAddressV4
      ipAddressV6: $ipAddressV6,
      geoLocation: $geoLocation,
      device: $device
      }
      groupBanner: $groupBanner
      bannerExtension: $bannerExtension
    }
  ) {
    groupStatusResponse  {
      data
      error
      message
      status

    }
  }
}
`,
updateMyConnectionsRequestNotification: gql`
mutation updateMyConnectionsRequestNotification (
  $accessToken: String
   ) {
    updateMyConnectionsRequestNotification(
    input: {
      accessToken: $accessToken
    }
  ) {
    connectionUpdateResponse  {
      data
      error
      message
      status
    }
  }
}
`,
updateUserLog: gql`
mutation updateUserLog (
    $accessToken: String,
    $npi: String,
    $ipAddressV6:String,
    $ipAddressV4: String,
    $device: String,
    $geoLocation: String,
    $channel: String,
    $description: String,
    $activity: String,
    $logType: String,) {
    updateUserLog(
    input: {
      accessToken: $accessToken
      logInput: {
        npi: $npi
        logType: $logType
        ipAddressV6: $ipAddressV6
        ipAddressV4: $ipAddressV4
        geoLocation: $geoLocation
        device: $device
        description: $description
        channel: $channel
        activity: $activity
      }
    }
    ){
    userProfileUpdateResponse  {
      data
      error
      message
      status
    }
  }
}
`,

sendNpiLookupFailureNotification: gql`
mutation sendNpiLookupFailureNotification (
  $fullName: String,
  $userEmail: String,
   ) {
    sendNpiLookupFailureNotification(
    input: {
      fullName: $fullName,
      userEmail: $userEmail
    }
  ) {
    npiLookupFailureNotificationResult  {
      error
      message
      status
    }
  }
}
`,


}
