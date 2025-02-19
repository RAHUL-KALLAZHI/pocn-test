import gql from 'graphql-tag';

export const queries = {
  getStates: gql`
   query  {
  states(orderBy: STATENAME_ASC) {
    nodes {
      id
      statename
      statevalue
    }
  }
} `,
  getProviderInfoCity: gql`
   query providerInfos(
    $firstName:String!,
    $lastName:String,
    $hcpDegreeGroupCode:String,
    $hcpState:String,
    $hcpLocality:String
    )  {
    providerInfos( filter: {
      firstName: {likeInsensitive: $firstName},
      lastName: {likeInsensitive: $lastName},
      hcpDegreeGroupCode: {includes: $hcpDegreeGroupCode},
      hcpState: {equalTo: $hcpState},
      hcpLocality: {likeInsensitive: $hcpLocality},
    }
    condition: {hcpState: $hcpState, hcpDegreeGroupCode: $hcpDegreeGroupCode}
   )
    {
      nodes {
      primarySpecialityCode
      firstName
      lastName
      hcpState
      npi
      cbsaName
      hcpType
      hcpDegreeCode
      hcpLocality
      hcpDegreeGroupCode
      }
    }
} `,
getProviderInfo: gql`
query providerInfos(
 $firstName:String!,
 $lastName:String,
 $hcpDegreeGroupCode:String,
 $hcpState:String
 )  {
 providerInfos( filter: {
   firstName: {likeInsensitive: $firstName},
   lastName: {likeInsensitive: $lastName},
   hcpDegreeGroupCode: {includes: $hcpDegreeGroupCode},
   hcpState: {equalTo: $hcpState},
 }
 condition: {hcpState: $hcpState,hcpDegreeGroupCode: $hcpDegreeGroupCode}
)
 {
   nodes {
   primarySpecialityCode
   firstName
   lastName
   hcpState
   npi
   cbsaName
   hcpType
   hcpDegreeCode
   hcpLocality
   hcpDegreeGroupCode
   }
 }
} `,
getUserProfile: gql`
query getUserProfile(
  $accessToken:String!
  ){
    getUserFullProfile(accessToken:$accessToken){
    status
    error
    message
    data {
      userAddressProfile {
        npi
        addressType
        addressUnit
        addressLine1
        addressLine2
        addressCity
        addressState
        addressZip
        addressCountry
        timeZone
        isPrimary
        userId
      }
      userBasicProfile {
        userId
        name
        lastName
        email
        aboutMe
        firstName
        website
        facebook
        twitter
        linkedin
        npi
        providerId
        profileTagLine
        primarySpecialityCode
        primarySpecialityDesc
        primarySpecialityGroup
        primarySpecialityGroupCode
        degreeGroupCode
        userDegreeCodeText
        atnp
        atpa
        globalOptOut
        rxAuthority
        pocnMentor
        pocnMentee
        pocnAmbassador
        communityAdvocate
        educatorOfDistinction
      }
      userContactProfile {
        faxNumber
        npi
        phoneNumber
        mobilePhoneNumber
        userId
        isPrimary
        email
        contactType
      }
      userDegreeProfile {
        degree
        degreeCode
        degreeGroup
        degreeGroupCode
        npi
        providerId
        userId
      }
      userEducationProfile {
        hcoDmcid
        hcoStatus
        hcoName
        hcoSubtype
        hcpGraduationYear
        npi
        userId
        providerId,
        hcoDegree,
        description
      }
      userExperienceProfile {
        description
        endYear
        experienceTitle
        hcoCountry
        hcoDmcid
        hcoLocality
        hcoName
        hcoPostcode
        hcoStateProvince
        npi
        providerId
        startYear
        userId
        tags
        employmentType
        startMonth
        endMonth
        healthOrganization

      }
      userImageProfile {
        fileContent
        fileExtension
        fileName
        npi
        imgType
        providerId
        userId
      }
      userResume {
        fileContent
        fileName
        npi
        providerId
        userId
        fileUploadedDate
      }
      userProfessionalProfile {
        bio
        endYear
        hcoAddress
        hcoName
        hcoLocality
        hcoDmcid
        hcoCountry
        hcoPostcode
        hcoStateProvince
        hcoStatus
        hcoSubtype
        hcoUnit
        isPrimary
        jobTitle
        npi
        providerId
        startYear
        userId
        employmentType
        description
        month
      }
      userCertLicense {
        certificationLicenceName
        hcoDmcid
        hcoName
        npi
        providerId
        userId
        yearOfCertification
        specialtyId
        specialty
      }
    }
    }
  }`,
getUserBasicProfile: gql`
query getUserBasicProfile(
  $accessToken:String!
  ){
    getUserBasicProfile(accessToken:$accessToken){
    status
    error
    message
    data {
      userAddressProfile {
        addressLine1
        addressCity
        addressState
        addressZip
        addressCountry
        isPrimary
      }
      userBasicProfile {
        userId
        name
        lastName
        email
        aboutMe
        firstName
        website
        facebook
        twitter
        linkedin
        npi
        providerId
        profileTagLine
        primarySpecialityCode
        primarySpecialityDesc
        primarySpecialityGroup
        primarySpecialityGroupCode
        degreeGroupCode
        userDegreeCodeText
      }
      userContactProfile {
        faxNumber
        phoneNumber
        mobilePhoneNumber
        isPrimary
        email
        contactType
      }
    }
    }
  }`,

pocnP2PConnections: gql`
query pocnP2PConnections(
 $firstName: String
 $npi: String
 )  {
  pocnP2PConnections(condition: {
   firstName: $firstName },
   filter: {npi: {notEqualTo: $npi}}) {
   nodes {
   firstName
   lastName
   fullName
   city
   state
   userId
   npi
   primarySpecialtyCode
   primarySpecialtyDesc
   emailId
   }
   totalCount
 }
} `,
getEmploymentType: gql`
query  {
  employmentTypes {
    nodes {
      id
      name
    }
  }
}`,
getAddressType: gql`
query  {
  addressTypes {
    nodes {
      id
      name
    }
  }
}`,
getContactType: gql`
query  {
  contactTypes {
    nodes {
      id
      name
    }
  }
}`,
getDegreeType: gql`
query {
  masterDegrees (orderBy: DEGREE_NAME_ASC){
    nodes {
      degreeCode
      degreeGroupCode
      degreeGroupName
      degreeId
      degreeName
    }
  }
}`
,
getTopicType: gql`
query  {
  masterTopics (orderBy: TITLE_ASC) {
    nodes {
      id
      title
    }
  }
}`
,
getLeadSourceType: gql`
query  {
  leadSourceMasters (orderBy: TITLE_ASC
    filter: {status: {equalTo: true}}
    ) {
    nodes {
      id
      title
      promoCodeLabel
      showStatus
    }
  }
}`
,
getGeneralTopicType: gql`
query  {
  masterTopicsGenerals( orderBy: TITLE_ASC, filter: {status: {equalTo: true}}) {
    nodes {
      id
      title
    }
  }
}`
,
getSpecialityType: gql`
query  {
  masterSpecialties (orderBy: SPECIALTY_NAME_ASC) {
    nodes {
      specialtyCode
      specialtyGroupCode
      specialtyGroupName
      specialtyId
      specialtyName
    }
  }
}`,
getTherapeuticArea: gql`
query ($accessToken:String!,$specCode:String!) {
  getTherapeuticAreasSpecCode(accessToken:$accessToken,specCode:$specCode) {
    data {
      id
      therapeuticAreas
    }
  }
}`,

logout: gql`
query (
$refreshToken:String!,
$userId:String,
$ipAddressV4:String,
$ipAddressV6:String,
$channel:String,
$device:String,
$geoLocation:String,
) {
  logout(realmName:"POCN",
  refreshToken:$refreshToken,
  userId:$userId,
  ipAddressV4:$ipAddressV4,
  ipAddressV6:$ipAddressV6,
  channel:$channel,
  device:$device,
  geoLocation:$geoLocation,
  )
}`,

getHcoList: gql`
query  {
  hcoMasters  (orderBy: HCO_NAME_ASC) {
    nodes {
      hcoCountry
      hcoDmcid
      hcoLocality
      hcoLocation
      hcoLocationGlid
      hcoLocationLat
      hcoLocationLong
      hcoPostCode
      hcoStateProvince
      hcoName
      hcoType
    }
  }
}`,
getEducationList: gql`
query  {
  educationMasters(orderBy: HCO_NAME_ASC) {
    nodes {
      id
      hcoName
      hcoDmcid
    }
  }
}`,
regionalMasters : gql`
query  {
  regionalMasters   (orderBy: TITLE_ASC
) {
    nodes {
      regionalId
      title
    }
  }
}`
,
groupScopMasters : gql`
query  {
  groupScopMasters(
    filter: {scopeStatus: {equalTo: true}}
    orderBy: SCOPE_TITLE_ASC
  ) {
    nodes {
      scopeId
      scopeTitle
    }
  }
}`
,
refreshToken: gql`
query refreshSession(
 $realm:String!,
 $refreshToken:String!
 )  {
  refreshTokenRealm(
    realm:$realm,
    refreshToken: $refreshToken
    )
}`,
getDialerCallers:gql`
query MyQuery($accessToken:String!) {
  getDialerCaller(
    accessToken:$accessToken
  ) {
    data {
      name
      npi
      phoneNumber
      providerId
      userId
    }
    error
    message
    status
  }
}`,
getUserPublicProfile: gql`
query getUserPublicProfile(
  $accessToken:String!
  $userId:String!
  ){
    getUserPublicProfile(accessToken:$accessToken,userId:$userId){
    status
    error
    message
    data {
      userAddressProfile {
        npi
        addressType
        addressUnit
        addressLine1
        addressLine2
        addressCity
        addressState
        addressZip
        addressCountry
        timeZone
        isPrimary
        userId
      }
      userBasicProfile {
        name
        lastName
        email
        aboutMe
        firstName
        website
        facebook
        twitter
        linkedin
        npi
        providerId
        userId
        profileTagLine
        primarySpecialityDesc
        degreeGroupCode
        userDegreeCodeText
        atnp
        atpa
        globalOptOut
        rxAuthority
        pocnMentor
        pocnMentee
        pocnAmbassador
        communityAdvocate
        educatorOfDistinction
      }
      userContactProfile {
        faxNumber
        npi
        phoneNumber
        mobilePhoneNumber
        isPrimary
        email
        contactType
        userId
      }
      userDegreeProfile {
        degree
        degreeCode
        degreeGroup
        degreeGroupCode
        npi
        providerId
        userId
      }
      userEducationProfile {
        hcoDmcid
        hcoStatus
        hcoName
        hcoSubtype
        hcpGraduationYear
        npi
        providerId
        hcoDegree
        description
        userId
      }
      userExperienceProfile {
        description
        endYear
        experienceTitle
        hcoCountry
        hcoDmcid
        hcoLocality
        hcoName
        hcoPostcode
        hcoStateProvince
        npi
        providerId
        startYear
        tags
        employmentType
        startMonth
        endMonth
        healthOrganization
        userId
      }
      userImageProfile {
        fileContent
        fileName
        npi
        imgType
        providerId
        userId
        fileExtension
      }
      userResume {
        fileContent
        fileName
        npi
        providerId
        fileUploadedDate
        userId
      }
      userProfessionalProfile {
        bio
        endYear
        hcoAddress
        hcoName
        hcoLocality
        hcoDmcid
        hcoCountry
        hcoPostcode
        hcoStateProvince
        hcoStatus
        hcoSubtype
        hcoUnit
        isPrimary
        jobTitle
        npi
        providerId
        startYear
        employmentType
        description
        month
        userId
      }
      userCertLicense {
        certificationLicenceName
        hcoDmcid
        hcoName
        npi
        providerId
        yearOfCertification
        specialtyId
        specialty
        userId
      }
    }
    }
}`,
getUserBasicPublicProfile: gql`
query getUserBasicPublicProfile(
  $accessToken:String!
  $userId:String!
  ){
    getUserBasicPublicProfile(accessToken:$accessToken,userId:$userId){
    status
    error
    message
    data {
      userAddressProfile {
        addressLine1
        addressCity
        addressState
        addressZip
        addressCountry
        isPrimary
      }
      userBasicProfile {
        name
        lastName
        email
        aboutMe
        firstName
        website
        facebook
        twitter
        linkedin
        npi
        providerId
        userId
        profileTagLine
        primarySpecialityDesc
        degreeGroupCode
        userDegreeCodeText
      }
      userContactProfile {
        faxNumber
        phoneNumber
        mobilePhoneNumber
        isPrimary
        email
      }
      userImageProfile {
        fileExtension
      }
    }
    }
  }`
  ,
  getUserFullPreferences: gql`
  query getUserFullPreferences(
    $accessToken:String!
    ){
      getUserFullPreferences(accessToken:$accessToken){
        status
        error
        message
        data {
          userChannelPreferences {
            channel
            npi
            providerId
            userId
            value
          }
          userInterestedAreasPreferences {
            isPrimary
            specialtyCode
            specialtyDesc
          }
          userInterestedTopicsPreferences {
            npi
            providerId
            topic
            userId
          }
        }
      }
    }`,

  getDialerCallerHistory: gql`
  query  ($accessToken:String!){
    getDialerCallerHistory(accessToken:$accessToken ) {
      data {
        callEndDate
        callStartDate
        duration
        fromPhone
        historyId
        npi
        providerId
        toPhone
        type
        userId
      }
    }
  }`,

userPrivilegeSections: gql`
query userPrivilegeSections(
 $userId:String!
 )  {
  userPrivilegeSections(condition: {
    userId: $userId
   }) {
    nodes {
      active
      sectionId
      title
      userId
    }
 }
} `,

masterOpportunities: gql`
query  {
  masterOpportunities {
    edges {
      node {
        id
        title
      }
    }
 }
} `,
getUserRecommendedConnectionsSpecialty: gql`
  query ($accessToken:String!,$startSet:Int!){
    getUserRecommendedConnectionsSpecialties1(accessToken:$accessToken,startSet : $startSet) {
      data {
        affiliationScore
        fullName
        hcpLocality
        hcpState
        npi
        userId
        providerId
        primarySpecialityDesc
        fileExtension
        firstName
        lastName
      }
      error
      message
      status
    }
  }`,
  getPocnUserRecommendations: gql`
  query ($accessToken:String!){
    getPocnUserRecommendations(accessToken:$accessToken) {
      data {
        affiliationScore
        fullName
        hcpLocality
        hcpState
        npi
        primarySpecialityDesc
        providerId
        userId
        fileExtension
        firstName
        lastName
      }
      error
      message
      status
    }
  }`,
  getUserRecommendedConnectionsSpecialties: gql`
  query ($accessToken:String!){
    getUserRecommendedConnectionsSpecialties(accessToken:$accessToken ) {
      data {
      affiliationId
      destCity
      destFullName
      destHcpDegreeCode
      destSpecialtyName
      providerHcpNpi
      providerId
      relatedHcpNpi
      relatedHcpProviderId
      registered
      emailId
      destState
      fileExtension
      }
      error
      message
      status
    }
  }`,
  getUserOpportunity: gql`
    query  ($accessToken:String!){
      getUserOpportunity(accessToken:$accessToken ) {
        data {
          npi
          opportunityId
          opportunityValue
          userId
          providerId
        }
        error
        message
        status
      }
    }`,
    getUserRequestedConnections: gql`
    query  ($accessToken:String!){
      getUserRequestedConnections(accessToken:$accessToken ) {
        data {
          agingDays
          connectionMessage
          connectionRequestId
          connectionStatus
          destCity
          destFullName
          destFirstName
          destLastName
          destHcpDegreeCode
          destSpecialtyName
          destState
          rejectReason
          requestorUserId
          source
          statusUpdateDate
          targetUserId
          profileTagLine
          destHcpDegreeGroupCode
          registered
          fileExtension
          targetImageUserId
        }
        error
        message
        status
      }
    }`,
    getMyConnections: gql`
    query  ($accessToken:String!){
      getMyConnections(accessToken:$accessToken ) {
        data {
          childUserId
          city
          connectionId
          degreeCode
          firstName
          fullName
          lastName
          parentUserId
          specialtyName
          state
          fileExtension
          imageUserId
        }
        error
        message
        status
      }
    }`
    ,
    notificationsList: gql`
    query notificationsLists($targetId:String!) {
      notificationsList(
        orderBy: CREATED_AT_DESC
        condition:{targetId:$targetId}
      ) {
          action
          createdAt
          message
          notificationId
          requestorUserId
          status
          targetUserId
        }
    }`
    ,
    getUserRecommendedConnectionsCities: gql`
    query getUserRecommendedConnectionsCities1($accessToken:String){
      getUserRecommendedConnectionsCities1(
          accessToken:$accessToken
        ) {
          data {
            affiliationScore
            fullName
            hcpLocality
            hcpState
            npi
            userId
            providerId
            primarySpecialityDesc
            fileExtension
            firstName
            lastName
          }

      }
    }`,
    getUserRecommendedConnectionsStates: gql`
    query getUserRecommendedConnectionsStates($accessToken:String){
      getUserRecommendedConnectionsStates(accessToken:$accessToken)
      {
        data {
          affiliationId
          destCity
          destFullName
          destHcpDegreeCode
          destSpecialtyName
          providerHcpNpi
          providerId
          relatedHcpNpi
          relatedHcpProviderId
          affiliationDescription
          affiliationType
          registered
          emailId
          destState
          fileExtension
          firstName
          lastName
        }

      }
    }`,
    getUserContactDetail: gql`
    query  ($accessToken:String!){
      getUserContactDetail(accessToken:$accessToken ) {
        data {
          userContactProfile {
            email
            mobilePhoneNumber
            phoneNumber
          }
        }
        error
        message
        status
      }
    }`,
    getUserContactDetailConfirmed: gql`
    query getPatientContactConfirmed($accessToken:String!){
      getPatientContactConfirmed(
        accessToken: $accessToken,
        )
        {
          data {
            email
            phone
            userId
          }
          error
          message
          status
        }
    }`,

    getUserRecommendedConnectionsWorkhistories: gql`
    query getUserRecommendedConnectionsExperience1($accessToken:String!){
      getUserRecommendedConnectionsExperience1(
        accessToken:$accessToken)
      {
        data {
          affiliationScore
          fullName
          hcpLocality
          hcpState
          npi
          userId
          providerId
          primarySpecialityDesc
          fileExtension
          firstName
          lastName
        }

      }
    }`,
    getUserRecommendedConnectionsEducations: gql`
    query getUserRecommendedConnectionsEducation1($accessToken:String!){
      getUserRecommendedConnectionsEducation1(
        accessToken:$accessToken)
      {
        data {
          affiliationScore
          fullName
          hcpLocality
          hcpState
          npi
          userId
          providerId
          primarySpecialityDesc
          fileExtension
          firstName
          lastName
        }

      }
    }`,
    providerUserInfos: gql`
    query providerUserInfos($userUniqueId :String, $npi:String, $emailId :String)  {
      providerUserInfos(condition: {userUniqueId : $userUniqueId, npi: $npi, emailId: $emailId}) {
        nodes {
          patientConnectRegistrationStatus
          emailId
          firstName
          followers
          fullName
          globalOptOut
          hcpType
          lastName
          npi
          originalSource
          patientConnectRegistrationStatus
          phoneNumber
          phoneLinked
          baaSigned
          hcpVerified
          hcpConsentVerified
          emailVerified
          userId
          primarySpecialtyDesc
          degreeCode
        }
      }
    } `,
    getDialerCaller: gql`
    query ($accessToken:String!){
      getDialerCaller(
        accessToken:$accessToken
      ) {
        data {
          name
          npi
          phoneNumber
          providerId
          userId
          callerUuid
        }
        error
        message
        status
      }
    }`,
    userFollowsList: gql`
    query userFollowsList($followerUserId :String, $followingUserId:String) {
      userFollowsList(condition: {followerUserId : $followerUserId, followingUserId: $followingUserId }) {

          followId

      }
    } `,
    getUserConnectionExist: gql`
    query getUserConnectionExist($accessToken:String!, $targetUserId:String){
      getUserConnectionExist(
        accessToken: $accessToken,
        targetUserId: $targetUserId)

        {
          data
          error
          message
          status

      }
    }`,
    getUserConnectionRequestExist: gql`
    query getUserConnectionRequestExist($accessToken:String!, $targetUserId:String, $targetNpi:String){
      getUserConnectionRequestExist(
        accessToken: $accessToken,
        targetUserId: $targetUserId,
        targetNpi: $targetNpi)

        {
          data {
            receivedStatus
            sentStatus
          }
          error
          message
          status
        }
      }`,
    getRegisteredUsersConnection: gql`
    query getRegisteredUsersConnection($accessToken:String!, $searchText:String, $pageNumber:Int,
       $itemsPerPage: Int){
      getRegisteredUsersConnection(
        accessToken: $accessToken,
        searchText: $searchText,
        pageNumber: $pageNumber,
        itemsPerPage: $itemsPerPage)
        {
          appConnection {
            city
            emailId
            firstName
            fullName
            graduationYear
            lastName
            middleName
            npi
            primarySpecialtyCode
            primarySpecialtyDesc
            primarySpecialtyGroup
            primarySpecialtyGroupCode
            providerId
            providerType
            state
            userId
            fileExtension
          }
          error
          message
          status
        }
    }`,
    getMdmUsersConnection: gql`
    query getMdmUsersConnection($accessToken:String!, $searchText:String, $pageNumber:Int,
       $itemsPerPage: Int){
        getMdmUsersConnection(
        accessToken: $accessToken,
        searchText: $searchText,
        pageNumber: $pageNumber,
        itemsPerPage: $itemsPerPage)
        {

          mdmConnection {
            city
            firstName
            fullName
            graduationYear
            lastName
            middleName
            npi
            primarySpecialtyCode
            primarySpecialtyDesc
            primarySpecialtyGroup
            primarySpecialtyGroupCode
            state
            providerId
            providerType
            hcpLocality
          }
          error
          message
          status
        }
    }`,
    getPatientStages: gql`
    query ($accessToken:String!){
      getPatientStages(
        accessToken:$accessToken
      ) {
        data {
          npi
          stage
          stageConfirmedDate
          startDate
          status
          userId
        }
        error
        message
        status
      }
    }`,
    getConnectionsCount: gql`
    query getConnectionsCount($accessToken:String!, $userId:String){
      getConnectionsCount(
        accessToken: $accessToken,
        userId: $userId)

        {
          data
          error
          message
          status

      }
    }`,
    getMdmUserProfile: gql`
    query getMdmUserProfile($accessToken:String!, $providerId:String){
      getMdmUserProfile(
        accessToken: $accessToken,
        providerId: $providerId)
        {
          data {
            userBasicProfile {
              aboutMe
              age
              atnp
              atpa
              connectedPatients
              connections
              dob
              email
              facebook
              firstName
              followers
              gender
              globalOptOut
              lastName
              linkedin
              middleName
              name
              npi
              originalSource
              pocnAmbassador
              pocnMember
              primarySpecialityCode
              pocnMentor
              pocnMentee
              primarySpecialityDesc
              primarySpecialityGroup
              primarySpecialityGroupCode
              profileTagLine
              providerId
              rxAuthority
              suffix
              twitter
              website
              veevaId
              userId
              degreeGroupCode
            }
            userAddressProfile {
              addressCity
              addressCountry
              addressLine1
              addressLine2
              addressState
              addressType
              addressUnit
              addressZip
              isPrimary
            }
            userDegreeProfile {
              degree
              degreeCode
              degreeGroup
              degreeGroupCode
            }
            userExperienceProfile {
              description
              employmentType
              endMonth
              endYear
              experienceTitle
              hcoAddress
              hcoCountry
              hcoDmcid
              hcoLocality
              hcoName
              hcoPostcode
              hcoStateProvince
              hcoStatus
              hcoSubtype
              hcoUnit
              healthOrganization
              jobTitle
            }
            userProfessionalProfile {
              employmentType
              endYear
              hcoAddress
              hcoCountry
              hcoDmcid
              hcoLocality
              hcoName
              hcoPostcode
              hcoStateProvince
              hcoSubtype
              hcoStatus
              hcoUnit
              jobTitle
              startYear
            }
          }
          error
          message
          status
        }
      }`,
patientConnectHcpVerifications: gql`
query patientConnectHcpVerifications(
 $npi:String
 )  {
  patientConnectHcpVerifications(condition: {
    npi: $npi
   }) {
    nodes {
      verificationType
    }
 }
} `,
getPatientContact: gql`
query getPatientContact($accessToken:String!){
  getPatientContact(
    accessToken: $accessToken,
    )
    {
      data {
        email
        phone
        userId
      }
      error
      message
      status
    }
}`,
getUserGroups: gql`
    query getUserGroups($accessToken:String!){
      getUserGroups(
        accessToken: $accessToken,
      )
      {
        data {
          description
          groupUuid
          name
          ownerName
          ownerUserId
          tagLine
          specialty
          tags
          therapeuticArea
          groupBanner
          groupIcon
          controlledGroup
          memberInvite
          type
          scope
          groupScope
          countMembers
          countPosts
          bannerExtension
          bannerFileName
          roleId
        }
        error
        message
        status
      }
  }`
  ,
  getMyPendingConnections: gql`
    query getMyPendingConnections($accessToken:String!){
      getMyPendingConnections(
        accessToken:$accessToken)
      {
        data {
          agingDays
          connectionRequestId
          connectionMessage
          destCity
          connectionStatus
          destHcpDegreeGroupCode
          destFullName
          destHcpDegreeCode
          destSpecialtyName
          destState
          rejectReason
          requestorUserId
          source
          statusUpdateDate
          targetUserId
          registered
          destFirstName
          destLastName
          fileExtension
          targetImageUserId
        }
      }
}`,
getUserGroupDetail: gql`
    query getUserGroupDetail($accessToken:String!, $groupId:String){
      getUserGroupDetail(
        accessToken: $accessToken,
        groupId: $groupId
      )
      {
        data {
      controlledGroup
      description
      firstName
      fullName
      groupBanner
      groupIcon
      groupScope
      groupUuid
      lastName
      memberInvite
      memberUserId
      name
      ownerName
      ownerUserId
      primarySpecialtyCode
      primarySpecialtyDesc
      scope
      specialty
      tagLine
      tags
      roleId
      therapeuticArea
      type
      enrollment
      private
      bannerExtension
      bannerFileName
        }
        error
        message
        status
      }
    }`,
    filterGroup: gql`
    query filterGroup($accessToken:String!, $searchText:String){
      filterGroup(
        accessToken: $accessToken,
        searchText: $searchText)
        {
          error
          message
          status
          data {
            description
            groupBanner
            groupIcon
            groupUuid
            name
            ownerName
            ownerUserId
            specialty
            tagLine
            tags
            therapeuticArea
            bannerExtension
            bannerFileName
          }
        }
    }`,
    groupMembersLists: gql`
    query groupMembersLists($groupId:String){
      groupMembersLists(
        orderBy: ID_ASC
        condition: {groupId: $groupId})
      {
        nodes {
          addressCity
          addressState
          createdDate
          degreeGroupCode
          description
          fileExtension
          firstName
          fullName
          groupId
          groupScope
          groupStatus
          id
          lastName
          memberUserId
          name
          npi
          primarySpecialtyCode
          primarySpecialtyDesc
          profileTagLine
          roleId
          scope
          status
          specialty
          tagLine
          type
          ownerUserId
        }
        totalCount
      }
    }`,
    myPendingGroupJoinRequests: gql`
    query groupMembersLists($memberUserId:String){
      groupMembersLists(
      condition: {memberUserId: $memberUserId, status: 0})
      {
        nodes {
          memberUserId
          status
          firstName
          lastName
          roleId
          name
          groupId
          fileExtension
          ownerUserId
          bannerExtension
          bannerFileName
        }
        totalCount
      }
    }`
    ,
    groupJoinRequestsPendingToApprove: gql`
    query getApprovalWaitingRequest($accessToken:String!){
      getApprovalWaitingRequest(
        accessToken: $accessToken,
      )
      {
        data {
          controlledGroup
          description
          groupBanner
          groupIcon
          groupUuid
          memberInvite
          name
          ownerName
          ownerUserId
          specialty
          tagLine
          tags
          therapeuticArea
          type
          firstName
          lastName
          memberUserId
          bannerFileName
          bannerExtension
          userImgExtension
        }
        error
        message
        status
      }
    }`
    ,
    providerMdmUserInfos: gql`
    query providerInfos($providerId: BigInt, $npi: BigInt)  {
      providerInfos(condition: {providerId: $providerId, npi: $npi}) {
        nodes {
          firstName
          fullName
          hcpType
          lastName
          npi
          providerId
        }
      }
    }`,
    patientConnectStatusCalls: gql`
    query patientConnectStatusCalls($userId: String)  {
      patientConnectStatusCalls(condition: {userId: $userId}) {
        nodes {
          baaSigned
          emailVerified
          hcpConsentVerified
          hcpVerified
          hcpVerifiedStatus
          patientConnectRegistrationStatus
          phoneLinked
          phoneNumber
          userId
          verificationType
          workEmailId
          rejectReason
        }
      }
    } `,
    providerInfoNpi: gql`
    query providerInfos($npi: BigInt)  {
      providerInfos(
        filter: {npi: {equalTo: $npi}}) {
        nodes {
      primarySpecialityCode
      firstName
      lastName
      hcpState
      npi
      cbsaName
      hcpType
      hcpDegreeCode
      hcpLocality
      hcpDegreeGroupCode
        }
      }
    }`,
    getEducationSearch: gql`
query educationMasters($hcoName: String){
  educationMasters (filter: {hcoName: {includesInsensitive: $hcoName}}) {
    nodes {
      id
      hcoName
      hcoDmcid
    }
  }
}`,
getHcoListSearch: gql`
query hcoMasters($hcoName: String){
  hcoMasters (filter: {hcoName: {includesInsensitive: $hcoName}}) {
    nodes {
      hcoCountry
      hcoDmcid
      hcoLocality
      hcoLocation
      hcoLocationGlid
      hcoLocationLat
      hcoLocationLong
      hcoPostCode
      hcoStateProvince
      hcoName
      hcoType
    }
  }
}`,
userLogs: gql`
query  userLogs($userId: String){
  userLogs(
    filter: {
      activity: {notIn: ["Login", "Registration", "Logout"]},
    }
    orderBy: CREATED_AT_DESC
    condition:{userId:$userId})
     {
    nodes {
      activity
      channel
      class
      createdAt
      description
      device
      geoLocation
      ipAddress
      logType
      npi
      userId
    }
  }
}`,
masterDocumentTypes: gql`
   query  {
    masterDocumentTypes(condition: {
      status:  true },
      ){
    nodes {
      id
      status
      title
    }
  }
} `,
pocnPosts: gql`
query  {
    pocnPosts(orderBy: POST_DATE_DESC condition: {
      postStatus:  1},
      ) {
      nodes {
        description
        fullName
        likeCount
        likedUsers
        postDate
        postId
        postStatus
        providerType
        specialty
        userId
        parentPostContent
        fileName
        postFileType
        fileExtension
      }
      totalCount
    }
} `,

getUserFirstName: gql`
query getUserFirstName(
  $accessToken:String!
  ){
  getUserFirstName(accessToken:$accessToken) {
      data
      error
      message
      status

    }
} `,
getUserLastName: gql`
query getUserLastName(
  $accessToken:String!
  ){
    getUserLastName(accessToken:$accessToken) {
      data
      error
      message
      status

    }
} `,
getUserTagline: gql`
query getUserTagline(
  $accessToken:String!
  ){
    getUserTagline(accessToken:$accessToken) {
      data
      error
      message
      status

    }
} `,
getUserState: gql`
query getUserState(
  $accessToken:String!
  ){
    getUserState(accessToken:$accessToken) {
      data
      error
      message
      status

    }
} `,
getUserCity: gql`
query getUserCity(
  $accessToken:String!
  ){
    getUserCity(accessToken:$accessToken) {
      data
      error
      message
      status

    }
} `,
getUserDegreeCodeText: gql`
query getUserDegreeCodeText(
  $accessToken:String!
  ){
    getUserDegreeCodeText(accessToken:$accessToken) {
      data
      error
      message
      status

    }
} `,
getUserZip: gql`
query getUserZip(
  $accessToken:String!
  ){
    getUserZip(accessToken:$accessToken) {
      data
      error
      message
      status

    }
} `,
getUserFaxNumber: gql`
query getUserFaxNumber(
  $accessToken:String!
  ){
    getUserFaxNumber(accessToken:$accessToken) {
      data
      error
      message
      status

    }
} `,
getUserPhoneNumber: gql`
query getUserPhoneNumber(
  $accessToken:String!
  ){
    getUserPhoneNumber(accessToken:$accessToken) {
      data
      error
      message
      status

    }
} `,
getUserMobileNumber: gql`
query getUserMobileNumber(
  $accessToken:String!
  ){
    getUserMobileNumber(accessToken:$accessToken) {
      data
      error
      message
      status

    }
} `,
getUserTwitterProfile: gql`
query getUserTwitterProfile(
  $accessToken:String!
  ){
    getUserTwitterProfile(accessToken:$accessToken) {
      data
      error
      message
      status

    }
} `,
getUserFbProfile: gql`
query getUserFbProfile(
  $accessToken:String!
  ){
    getUserFbProfile(accessToken:$accessToken) {
      data
      error
      message
      status

    }
} `,
getUserLinkedinProfile: gql`
query getUserLinkedinProfile(
  $accessToken:String!
  ){
    getUserLinkedinProfile(accessToken:$accessToken) {
      data
      error
      message
      status

    }
} `,
getUserWebsite: gql`
query getUserWebsite(
  $accessToken:String!
  ){
    getUserWebsite(accessToken:$accessToken) {
      data
      error
      message
      status

    }
} `,
searchPost: gql`
query searchPost(
  $accessToken:String!
  $searchText: String,
  $offsetVal:Int
  ){
    searchPost(accessToken:$accessToken
      searchText:$searchText, offsetVal: $offsetVal) {
        data {
          description
          fullName
          likeCount
          postDate
          postId
          postStatus
          providerType
          specialty
          userId
          likedUsers
          postFileType
          fileName
          fileExtension
          parentPostContent
          postFrom
        }
        error
      message
      status
    }
} `,
userPocnPosts: gql`
query  {
  userPocnPosts{
      nodes {
        createdAt
        description
        postId
      }
    }
} `,
getUserConnectionRequest: gql`
query getUserConnectionRequest($accessToken:String!, $targetUserId:String, $targetNpi:String){
  getUserConnectionRequest(
    accessToken: $accessToken,
    targetUserId: $targetUserId,
    targetNpi: $targetNpi)

    {
      requestedConnections {
        connectionRequestId
        createdDate
        requestorUserFullName
        requestorUserId
        targetUserEmailId
        targetUserFirstName
        targetUserFullName
        targetUserId
        targetUserLastName
        connectionStatus
      }
      error
      message
      status
      connections {
        childUserId
        connectionDate
        connectionId
        parentUserId
      }
    }

  }`,
  getDetailPocnPosts: gql`
query($postId:String)  {
    pocnPosts(condition: {
     postId:$postId},
      ) {
      nodes {
        description
        fullName
        likeCount
        likedUsers
        postDate
        postId
        postStatus
        providerType
        specialty
        userId
        parentPostContent
        parentPostId
        fileName
        postFileType
        fileExtension
        postFrom
        feedContent
        feedTitle
        feedAuthor
        feedUrl
      }
      totalCount
    }
} `,
pocnRefetchPosts: gql`
query  {
    pocnPosts(orderBy: POST_DATE_DESC condition: {
      postStatus:  1},
      ) {
      nodes {
        description
        fullName
        likeCount
        likedUsers
        postDate
        postId
        postStatus
        providerType
        specialty
        userId
        parentPostContent
        fileName
        postFileType
        fileExtension
      }
      totalCount
    }
} `,

    providerUserImageInfos: gql`
    query providerUserImageInfos($userId:String){
      providerUserImageInfos (condition: {userId:$userId}){
        nodes {
          fileExtension
        }
      }
    }`,
    getUserStat: gql`
    query getUserStat($accessToken:String){
      getUserStat(
        accessToken: $accessToken)
        {
        data {
          connectionCount
          likesCount
          pointsCount
          postsCount
          followersCount
        }
        error
        message
        status

      }
    }`,
   getPost: gql`
    query ($accessToken:String!,$limit:Int){
      getPost(accessToken:$accessToken,getLimit:$limit) {
       data {
          description
          fileExtension
          fileName
          fullName
          likeCount
          likedUsers
          postDate
          postFileType
          postId
          postStatus
          providerType
          specialty
          userId
          parentPostContent
          postFrom
        }
        error
        message
        status
      }
    }`,
getUserStatPublicProfile: gql`
query getUserStat($accessToken:String,
  $userId : String){
    getUserStat(
    accessToken: $accessToken, userId:$userId)
    {
    data {
      connectionCount
      likesCount
      pointsCount
      postsCount
      followersCount
    }
    error
    message
    status

  }
}`,
getMdmUsersGroup: gql`
    query getMdmUsersGroup($accessToken:String!, $searchText:String, $pageNumber:Int,
       $itemsPerPage: Int, $groupId: String ){
        getMdmUsersGroup(
        accessToken: $accessToken,
        searchText: $searchText,
        pageNumber: $pageNumber,
        itemsPerPage: $itemsPerPage,
        groupId: $groupId )
        {

          mdmConnection {
            city
            firstName
            fullName
            graduationYear
            lastName
            middleName
            npi
            primarySpecialtyCode
            primarySpecialtyDesc
            primarySpecialtyGroup
            primarySpecialtyGroupCode
            providerId
            state
            providerType
            hcpLocality
          }
          error
          message
          status
          totalCount
        }
    }`,
    getRegisteredUsersGroup: gql`
    query getRegisteredUsersGroup($accessToken:String!, $searchText:String, $pageNumber:Int,
       $itemsPerPage: Int, $groupId: String){
        getRegisteredUsersGroup(
        accessToken: $accessToken,
        searchText: $searchText,
        pageNumber: $pageNumber,
        itemsPerPage: $itemsPerPage,
        groupId: $groupId)
        {
          error
          message
          status
          totalCount
          appConnection {
            city
            emailId
            fileExtension
            firstName
            fullName
            graduationYear
            lastName
            middleName
            npi
            primarySpecialtyCode
            primarySpecialtyDesc
            primarySpecialtyGroup
            primarySpecialtyGroupCode
            providerId
            state
            providerType
            userId
          }
        }

    }`,
    getMySentInvitationRequest: gql`
query getMySentInvitationRequest($accessToken:String){
  getMySentInvitationRequest(
    accessToken: $accessToken)
    {
    data {
      firstName
      fullName
      groupUuid
      lastName
      memberUserId
      name
      bannerExtension
      bannerFileName
      description
      memberImageExtension
      ownerName
      ownerUserId
      primarySpecialtyCode
      primarySpecialtyDesc
      tagLine
      type
    }
    error
    message
    status

  }
}`,
getMyReceivedInvitationRequest: gql`
query getMyReceivedInvitationRequest($accessToken:String){
  getMyReceivedInvitationRequest(
    accessToken: $accessToken)
    {
    data {
      firstName
      fullName
      groupUuid
      lastName
      memberUserId
      name
      bannerExtension
      bannerFileName
      description
      memberImageExtension
      ownerName
      ownerUserId
      primarySpecialtyCode
      primarySpecialtyDesc
      tagLine
      type
    }
    error
    message
    status

  }
}`,
pocnGroupPosts: gql`
    query pocnPosts($groupUuid:String){
      pocnPosts(
        orderBy: POST_DATE_DESC
      condition: {groupUuid: $groupUuid, audienceType: 1, postStatus:  1})
      {
        nodes {
          description
          engagmentCount
          fileExtension
          fileName
          fullName
          groupUuid
          id
          likeCount
          likedUsers
          parentPostContent
          parentPostId
          postDate
          postFileType
          postId
          postStatus
          providerType
          specialty
          userId
        }
      }
    }`
    ,
    getUserGroupRequestStatus: gql`
    query getUserGroupRequestStatus($accessToken:String, $groupId:String){
      getUserGroupRequestStatus(
        accessToken: $accessToken , groupId: $groupId )
        {
        data
        error
        message
        status

      }
    }`,
    searchPostGroup: gql`
    query searchPostGroup(
      $accessToken:String!
      $searchText: String,
      $groupId: String
      ){
        searchPostGroup(accessToken:$accessToken
          searchText:$searchText, groupId: $groupId) {
            data {
              description
              fileExtension
              fileName
              fullName
              likeCount
              likedUsers
              parentPostContent
              postDate
              postFileType
              postId
              postStatus
              providerType
              specialty
              userId
            }
            error
          message
          status
        }
    } `,
    relatedGroups: gql`
    query relatedGroups($accessToken:String,$groupId: String){
      relatedGroups(
        accessToken: $accessToken
        groupId: $groupId)
        {
        data {
          description
          groupMatchScore
          groupScope
          groupUuid
          name
          ownerName
          ownerUserId
          scope
          specialtyCode
          specialty
          tagLine
          therapeuticArea
          tags
          type
          bannerExtension
          bannerFileName
        }
        error
        message
        status

      }
    }`,
    groupRecommendationByType: gql`
    query ($accessToken:String!){
      groupRecommendationByType(accessToken:$accessToken ) {
        data {
          description
          groupScope
          groupUuid
          name
          ownerName
          ownerUserId
          scope
          specialty
          tagLine
          tags
          therapeuticArea
          type
          groupMatchScore
          bannerExtension
          bannerFileName
        }
        error
        message
        status
      }
    }`,
    groupRecommendationBySpecialty: gql`
    query ($accessToken:String!){
      groupRecommendationBySpecialty(accessToken:$accessToken ) {
        data {
          description
         groupScope
         groupUuid
         name
         ownerName
         ownerUserId
         scope
         specialty
         tagLine
         tags
         therapeuticArea
         type
         groupMatchScore
         bannerExtension
         bannerFileName
        }
        error
        message
        status
      }
    }`,
    groupRecommendationByTa: gql`
    query ($accessToken:String!){
      groupRecommendationByTa(accessToken:$accessToken ) {
        data {
          description
          groupMatchScore
          groupScope
          groupUuid
          name
          ownerName
          ownerUserId
          scope
          specialtyCode
          specialty
          tagLine
          tags
          therapeuticArea
          type
          bannerExtension
          bannerFileName
        }
        error
        message
        status
      }
    }`,
    groupRecommendationByLocation: gql`
    query ($accessToken:String!){
      groupRecommendationByLocation(accessToken:$accessToken ) {
        data {
          description
          groupMatchScore
          groupScope
          groupUuid
          name
          ownerName
          ownerUserId
          scope
          specialty
          tagLine
          tags
          therapeuticArea
          type
          bannerExtension
          bannerFileName
        }
        error
        message
        status
      }
    }`,
    groupRecommendationByName: gql`
    query ($accessToken:String!){
      groupRecommendationByName(accessToken:$accessToken ) {
        data {
          description
          groupMatchScore
          groupScope
          groupUuid
          name
          ownerName
          ownerUserId
          scope
          specialty
          tagLine
          tags
          therapeuticArea
          type
          bannerExtension
          bannerFileName
        }
        error
        message
        status
      }
    }`,
    groupRecommendationByTags: gql`
    query ($accessToken:String!){
      groupRecommendationByTags(accessToken:$accessToken ) {
        data {
          description
          groupMatchScore
          groupScope
          groupUuid
          name
          ownerName
          ownerUserId
          scope
          specialty
          tagLine
          tags
          therapeuticArea
          type
          bannerExtension
          bannerFileName
        }
        error
        message
        status
      }
    }`,
    groupRecommendationByPocn: gql`
    query ($accessToken:String!){
      groupRecommendationByPocn(accessToken:$accessToken ) {
        data {
          description
          groupMatchScore
          groupScope
          groupUuid
          name
          ownerName
          ownerUserId
          scope
          specialtyCode
          specialty
          tagLine
          therapeuticArea
          tags
          type
          bannerExtension
          bannerFileName
        }
        error
        message
        status
      }
    }`,
    getUserPost: gql`
    query ($accessToken:String!,$limit:Int){
      getUserPost(accessToken:$accessToken,getLimit:$limit ) {
        data {
          userId
          parentPostContent
          fileName
          description
          fileExtension
          fullName
          likeCount
          likedUsers
          postDate
          postFrom
          postFileType
          postId
          postStatus
          providerType
          specialty
        }
        error
        message
        status
      }
    }`,
    getUserMyPost: gql`
    query ($accessToken:String!,$limit:Int){
      getMyPost(accessToken:$accessToken,getLimitUser:$limit ) {
        data {
          createdDate
        description
        fileExtension
        fileName
        fullName
        likeCount
        likedUsers
        parentPostContent
        postDate
        postFileType
        postFrom
        postId
        postStatus
        providerType
        shareId
        shareTo
        sharedBy
        sharedStatus
        specialty
        userId
        originalFileExtension
        originalPostFullName
        originalPostUserId
        }
        error
        message
        status
      }
    }`,
    getConnectionMyPost: gql`
    query ($accessToken:String!,$limit:Int){
      getMyPost(accessToken:$accessToken,getLimitConn:$limit ) {
        data {
        createdDate
        description
        fileExtension
        fileName
        fullName
        likeCount
        likedUsers
        parentPostContent
        postDate
        postFileType
        postFrom
        postId
        postStatus
        providerType
        shareId
        shareTo
        sharedBy
        sharedStatus
        specialty
        userId
        originalFileExtension
        originalPostFullName
        originalPostUserId
        }
        error
        message
        status
      }
    }`,
    getPublishMyPost: gql`
    query ($accessToken:String!,$limit:Int){
      getMyPost(accessToken:$accessToken,getLimitPub:$limit ) {
        data {
          createdDate
        description
        fileExtension
        fileName
        fullName
        likeCount
        likedUsers
        parentPostContent
        postDate
        postFileType
        postFrom
        postId
        postStatus
        providerType
        shareId
        shareTo
        sharedBy
        sharedStatus
        specialty
        userId
        originalFileExtension
        originalPostFullName
        originalPostUserId
        }
        error
        message
        status
      }
    }`,
    getGroupMyPost: gql`
    query ($accessToken:String!,$limit:Int){
      getMyPost(accessToken:$accessToken,getLimitGroup:$limit ) {
        data {
          createdDate
        description
        fileExtension
        fileName
        fullName
        likeCount
        likedUsers
        parentPostContent
        postDate
        postFileType
        postFrom
        postId
        postStatus
        providerType
        shareId
        shareTo
        sharedBy
        sharedStatus
        specialty
        userId
        originalFileExtension
        originalPostFullName
        originalPostUserId
        }
        error
        message
        status
      }
    }`,
    getOtherMyPost: gql`
    query ($accessToken:String!,$limit:Int){
      getMyPost(accessToken:$accessToken,getLimitOther:$limit ) {
        data {
          createdDate
        description
        fileExtension
        fileName
        fullName
        likeCount
        likedUsers
        parentPostContent
        postDate
        postFileType
        postFrom
        postId
        postStatus
        providerType
        shareId
        shareTo
        sharedBy
        sharedStatus
        specialty
        userId
        originalFileExtension
        originalPostFullName
        originalPostUserId
        }
        error
        message
        status
      }
    }`,
    getUserGroupMemberCheck: gql`
    query getUserGroupMemberCheck($accessToken:String,$groupId: String){
      getUserGroupMemberCheck(
        accessToken: $accessToken
        groupId: $groupId)

    }`,
    getPostUserSearch: gql`
    query getRegisteredUsersConnection($accessToken:String!, $searchText:String, $pageNumber:Int,
      $itemsPerPage: Int){
     getRegisteredUsersConnection(
       accessToken: $accessToken,
       searchText: $searchText,
       pageNumber: $pageNumber,
       itemsPerPage: $itemsPerPage)
       {
         appConnection {
           city
           emailId
           firstName
           fullName
           graduationYear
           lastName
           middleName
           npi
           primarySpecialtyCode
           primarySpecialtyDesc
           primarySpecialtyGroup
           primarySpecialtyGroupCode
           providerId
           providerType
           state
           userId
           fileExtension
         }
         error
         message
         status
       }
    }`,
    getPostGroupSearch: gql`
    query getUserGroupsSearch(
      $accessToken:String!
      $searchText: String,
      ){
        getUserGroupsSearch(accessToken:$accessToken
          searchText:$searchText) {
            data {
              bannerExtension
              bannerFileName
              controlledGroup
              countMembers
              countPosts
              description
              firstName
              enrollment
              fullName
              groupBanner
              groupIcon
              groupScope
              groupUuid
              lastName
              memberInvite
              name
              memberUserId
              ownerName
              ownerUserId
              primarySpecialtyCode
              primarySpecialtyDesc
              private
              roleId
              scope
              specialty
              tagLine
              tags
              therapeuticArea
              type
              userImgExtension
            }
            error
          message
          status
        }
    }`,
    getGroupPosts: gql`
    query getGroupPosts(
      $accessToken:String!
      $groupId: String,
      ){
        getGroupPosts(accessToken:$accessToken
          groupId:$groupId) {
            data {
              createdDate
              description
              fileExtension
              fileName
              fullName
              likeCount
              likedUsers
              originalFileExtension
              originalPostUserId
              originalPostFullName
              parentPostContent
              postDate
              postFileType
              postFrom
              postId
              postStatus
              providerType
              shareId
              shareTo
              sharedBy
              sharedStatus
              specialty
              userId
            }
            error
          message
          status
        }
    }`,
    getDefaultPost: gql`
    query ($accessToken:String!){
      getDefaultPost(accessToken:$accessToken) {
        data {
          createdDate
          description
          fileExtension
          fileName
          likeCount
          fullName
          likedUsers
          originalFileExtension
          originalPostFullName
          originalPostUserId
          parentPostContent
          postFrom
          postDate
          postFileType
          postId
          postStatus
          providerType
          shareId
          shareTo
          sharedBy
          specialty
          userId
          sharedStatus
        }
        error
        message
        status
      }
    }`,
    getUserShareGroups: gql`
    query getUserGroups($accessToken:String!
      $sortAlphabet: String){
      getUserGroups(
        accessToken: $accessToken
        sortAlphabet: $sortAlphabet,
      )
      {
        data {
          description
          groupUuid
          name
          ownerName
          ownerUserId
          tagLine
          specialty
          tags
          therapeuticArea
          groupBanner
          groupIcon
          controlledGroup
          memberInvite
          type
          scope
          groupScope
          countMembers
          countPosts
          bannerExtension
          bannerFileName
          roleId
        }
        error
        message
        status
      }
  }`
  ,
  getMyConnectionsRequestNotification: gql`
  query getMyConnectionsRequestNotification($accessToken:String){
    getMyConnectionsRequestNotification(
      accessToken: $accessToken)
      {
      data {
        requestorCount
        requestorNames
      }
      error
      message
      status

    }
  }`,
  getTelephoneCountryCode: gql`
  query getTelephoneCountryCode($accessToken:String){
    getTelephoneCountryCode(
      accessToken: $accessToken)
      {
      data {
        countryCode
      }
      error
      message
      status
    }
  }`,
};
