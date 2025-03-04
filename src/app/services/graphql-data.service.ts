import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { queries } from './queries';
import { mutations } from './mutation';
import { States, ProviderInfo, Educations, Employments, Addresses, Contacts, Degrees, Regionals, Scopes, Topics, LeadSources, Hcos, Specialties, RefreshSession, DialerCallers, DialerCallerHistory, TherapeuticAreas, GeneralTopics} from './type';
import { LocalStorageManager } from './local-storage-manager';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GraphqlDataService {
  constructor(private apollo: Apollo,
    private pocnLocalStorageManager: LocalStorageManager,
    private httpClient: HttpClient) { }
  getStates() {
    const subscription = this.apollo.query<States>({
      query: queries.getStates,
      fetchPolicy: 'network-only'
    });
    return subscription;
  }
  getEmploymentType() {
    const subscription = this.apollo.query<Employments>({
      query: queries.getEmploymentType,
      fetchPolicy: 'network-only'
    });
    return subscription;
  }
  getAddressType() {
    const subscription = this.apollo.query<Addresses>({
      query: queries.getAddressType,
      fetchPolicy: 'network-only'
    });
    return subscription;
  }
  getContactType() {
    const subscription = this.apollo.query<Contacts>({
      query: queries.getContactType,
      fetchPolicy: 'network-only'
    });
    return subscription;
  }
  getDegreeType() {
    const subscription = this.apollo.query<Degrees>({
      query: queries.getDegreeType,
      fetchPolicy: 'network-only'
    });
    return subscription;
  }
  getTopicType() {
    const subscription = this.apollo.query<Topics>({
      query: queries.getTopicType,
      fetchPolicy: 'network-only'
    });
    return subscription;
  }
  getLeadSourceType() {
    const subscription = this.apollo.query<LeadSources>({
      query: queries.getLeadSourceType,
      fetchPolicy: 'network-only'
    });
    return subscription;
  }
  getGeneralTopicType() {
    const subscription = this.apollo.query<GeneralTopics>({
      query: queries.getGeneralTopicType,
      fetchPolicy: 'network-only'
    });
    return subscription;
  }
  getHcoList() {
    const subscription = this.apollo.query<Hcos>({
      query: queries.getHcoList,
      fetchPolicy: 'network-only'
    });
    return subscription;
  }

  getEducationList() {
    const subscription = this.apollo.query<Educations>({
      query: queries.getEducationList,
      fetchPolicy: 'network-only'
    });
    return subscription;
  }
  groupScopMasters() {
    const subscription = this.apollo.query<Scopes>({
      query: queries.groupScopMasters,
      fetchPolicy: 'network-only'
    });
    return subscription;
  }
  regionalMasters() {
    const subscription = this.apollo.query<Regionals>({
      query: queries.regionalMasters,
      fetchPolicy: 'network-only'
    });
    return subscription;
  }
  getSpecialityType() {
    const subscription = this.apollo.query<Specialties>({
      query: queries.getSpecialityType,
      fetchPolicy: 'network-only'
    });
    return subscription;
  }
  providerUserImageInfos(userId:string) {
    const subscription = this.apollo.query<ProviderInfo>({
      query: queries.providerUserImageInfos,
      variables: {
        userId:userId,
      },
      fetchPolicy: 'network-only'
    });
    return subscription;
  }
  getTherapeuticArea(accessToken:string,specCode:string) {
    const subscription = this.apollo.use('second').query<TherapeuticAreas>({
      query: queries.getTherapeuticArea,
      variables: {
        accessToken:accessToken,
        specCode:specCode
      },
      fetchPolicy: 'network-only'
    });
    return subscription;
  }

  getProviderInfo(filter: any) {
    const subscription = this.apollo.query<ProviderInfo>({
      query: queries.getProviderInfo,
      variables: filter,
      fetchPolicy: 'network-only'
    });
    return subscription;
  }
  getRefreshToken(args: any) {
    const subscription = this.apollo.query<RefreshSession>({
      query: queries.refreshToken,
      variables: args,
      fetchPolicy: 'network-only'
    });
    return subscription;
  }
  refreshSession
  createUser(args: any) {
    return this.apollo.mutate<any>({
      mutation: mutations.createUser,
      variables: args,
    }).pipe(map((data: any) => data))
  }
  getUserProfile(accessToken:string) {
    const subscription = this.apollo.use('second')?.query<ProviderInfo>({
      query: queries.getUserProfile,
      variables: {
        accessToken:accessToken
      },
      fetchPolicy: 'network-only'
    });
    return subscription;
  }
  getUserBasicProfile(accessToken:string) {
    const subscription = this.apollo.use('second')?.query<ProviderInfo>({
      query: queries.getUserBasicProfile,
      variables: {
        accessToken:accessToken
      },
      fetchPolicy: 'network-only'
    });
    return subscription;
  }
  getSearchUser(searchText:string, npi:string) {
    const subscription = this.apollo.use('second').query<ProviderInfo>({
      query: queries.pocnP2PConnections,
      variables: {
        firstName:searchText,
        npi:npi
      },
      fetchPolicy: 'network-only'
    });
    return subscription;
  }
  establishSession(args:any) {
    return this.apollo.mutate<any>({
      mutation: mutations.establishSession,
      variables: {
        accessCode:args.accessCode,
        redirectUrl:args.redirectUrl,
      },
     // fetchPolicy: 'network-only'
    }).pipe(map((data: any) => data))
  }
  establishLoginSession(args:any) {

    //console.log(args);
    return this.apollo.mutate<any>({
      mutation: mutations.pocnIamEstablishSession,
      variables: {
        password:args.password,
        username:args.username,
        ipAddressV4:args.ipAddressV4,
        ipAddressV6:args.ipAddressV6,
        device:args.device,
        channel:args.channel,
        deviceLocation:args.deviceLocation,
      },
    }).pipe(map((data: any) => data))
  }
  updateUserProfileImage(args: any) {
    return this.apollo.use('second').mutate<any>({
      mutation: mutations.updateUserProfileImage,
      variables: args,
    }).pipe(map((data: any) => data))
  }

  updateUserResume(args: any) {
    return this.apollo.use('second').mutate<any>({
      mutation: mutations.updateUserResume,
      variables: args,
    }).pipe(map((data: any) => data))
  }
  updateEducation(args: any,token:string) {
    return this.apollo.use('second').mutate<any>({
      mutation: mutations.updateUserEducation,
      variables: { 'educationInput':args,'accessToken':token },
    }).pipe(map((data: any) => data))
  }

  updateProfessionalProfileDetails(args: any) {
    return this.apollo.use('second').mutate<any>({
      mutation: mutations.updateUserProfessionalProfile,
      variables: args,
    }).pipe(map((data: any) => data))
  }

  updateUserBasicProfile(args: any) {
    return this.apollo.use('second').mutate<any>({
      mutation: mutations.updateUserBasicProfile,
      variables: args,
    }).pipe(map((data: any) => data))
  }
  updateUserContactProfile(args: any,token:string) {
    return this.apollo.use('second').mutate<any>({
      mutation: mutations.updateUserContactProfile,
      variables: { 'contactProfileInput':args,'accessToken':token },
    }).pipe(map((data: any) => data))
  }
  updateAddress(args: any,token:string) {
    return this.apollo.use('second').mutate<any>({
      mutation: mutations.updateUserAddressProfile,
      variables: { 'addressInput':args,'accessToken':token },
    }).pipe(map((data: any) => data))
  }

  updateWorkHistory(args: any,token:string) {
    return this.apollo.use('second').mutate<any>({
      mutation: mutations.updateUserExperience,
      variables: { 'workHistoryInput':args,'accessToken':token },
    }).pipe(map((data: any) => data))
  }

  updateLicense(args: any,token:string) {
    return this.apollo.use('second').mutate<any>({
      mutation: mutations.updateCertLicenseInfo,
      variables: { 'licenseInput':args,'accessToken':token },
    }).pipe(map((data: any) => data))
  }

  getDialerCallers(accessToken:string){
    return this.apollo.use('second').query<DialerCallers>({
      query: queries.getDialerCallers,
      variables: {
        accessToken:accessToken
      },
    })
  }
  logout(refreshToken:string, accessToken:string, userId:string, ipAddressV4:string, ipAddressV6:string, channel:string, device:string, geoLocation:string){
    return this.apollo.use('second').query<any>({
      query: queries.logout,
      variables: {
        refreshToken:refreshToken,
        accessToken:accessToken,
        userId:userId,
        ipAddressV4:ipAddressV4,
        ipAddressV6:ipAddressV6,
        channel:channel,
        device:device,
        geoLocation:geoLocation,
      },

    })

  }

  addCallerHistory(args: any, token: string) {
    return this.apollo.use('second').mutate<any>({
      mutation: mutations.addCallerHistory,
      variables: {
        fromPhone: args.fromPhone,
        npi: args.npi,
        toPhone: args.toPhone,
        providerId: args.providerId,
        type: args.type,
        userId: args.userId,
        duration: args.duration,
        accessToken: token
      },
    }).pipe(map((data: any) => data))
}

getUserFullPreferences(accessToken:string) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.getUserFullPreferences,
    variables: {
      accessToken:accessToken
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getUserPublicProfile(accessToken:string, userId:string) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.getUserPublicProfile,
    variables: {
      accessToken:accessToken,
      userId: userId
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getUserBasicPublicProfile(accessToken:string, userId:string) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.getUserBasicPublicProfile,
    variables: {
      accessToken:accessToken,
      userId: userId
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
  getDialerCallerHistory(accessToken: string) {
    return this.apollo.use('second').query<DialerCallerHistory>({
      query: queries.getDialerCallerHistory,
      variables: {
        accessToken: accessToken
      },
    })
  }

updateChannelPreferences(args: any,token:string) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateChannelPreferences,
    variables: { 'channelInput':args,'accessToken':token },
  }).pipe(map((data: any) => data))
}
updateInterestedTopicsPreferences(args: any,token:string) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateInterestedTopicsPreferences,
    variables: { 'userTopicInput':args,'accessToken':token },
  }).pipe(map((data: any) => data))
}
updateInterestedAreasPreferences(args: any,token:string) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateInterestedAreasPreferences,
    variables: { 'userInterestedInput':args,'accessToken':token },
  }).pipe(map((data: any) => data))
}
getUserPrivilegeSections(userId:string) {
  const subscription = this.apollo.query<ProviderInfo>({
    query: queries.userPrivilegeSections,
    variables: {
      userId: userId
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getMasterOpportunities() {
  const subscription = this.apollo.query<ProviderInfo>({
    query: queries.masterOpportunities,
    // variables: {
    //   userId: userId
    // },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
updateUserOpportunity(args: any,token:string) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateUserOpportunity,
    variables: { 'userOpportunityInput':args,'accessToken':token },
  }).pipe(map((data: any) => data))
}
updateUserPrivilegeConfig(args: any,token:string) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateUserPrivilegeConfig,
    variables: { 'userPrivilegeInput':args,'accessToken':token },
  }).pipe(map((data: any) => data))
}
updateUserPrivilegeConfigSingle(args: any,token:string) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateUserPrivilegeConfigSingle,
    variables: { 'userPrivilegeInput':args,'accessToken':token },
  }).pipe(map((data: any) => data))
}
getUserRecommendedConnectionsSpecialty(accessToken: string,startSet) {
  return this.apollo.use('second')?.query<ProviderInfo>({
    query: queries.getUserRecommendedConnectionsSpecialty,
    fetchPolicy: 'network-only',
    variables: {
      accessToken: accessToken,
      startSet: startSet
    },
  })
}
getUserRecommendedConnectionsSpecialties(accessToken: string) {
  return this.apollo.use('second')?.query<ProviderInfo>({
    query: queries.getUserRecommendedConnectionsSpecialties,
    fetchPolicy: 'network-only',
    variables: {
      accessToken: accessToken
    },
  })
}
getUserOpportunity(accessToken: string) {
  return this.apollo.use('second').query<ProviderInfo>({
    query: queries.getUserOpportunity,
    variables: {
      accessToken: accessToken
    },
  })
}
  getUserRequestedConnections(accessToken: string) {
    return this.apollo.use('second')?.query<ProviderInfo>({
      query: queries.getUserRequestedConnections,
      fetchPolicy: 'network-only',
      variables: {
        accessToken: accessToken
      },
    })
  }
  submitUserConnectionRequest(args: any) {
    return this.apollo.use('second').mutate<any>({
      mutation: mutations.submitUserConnectionRequest,
      variables: args,
    }).pipe(map((data: any) => data))
  }
  sendConnectionRequestMail(args: any) {
    return this.apollo.use('second').mutate<any>({
      mutation: mutations.sendConnectionRequestMail,
      variables: args,
    }).pipe(map((data: any) => data))
  }
  sendApproveConnectionRequestMail(args: any){
    return this.apollo.use('second').mutate<any>({
      mutation: mutations.sendApproveConnectionRequestMail,
      variables: args,
    }).pipe(map((data: any) => data))
  }
  submitApproveConnectionRequest(args: any) {
    return this.apollo.use('second').mutate<any>({
      mutation: mutations.submitApproveConnectionRequest,
      variables: args,
    }).pipe(map((data: any) => data))
  }
  getMyConnections(accessToken: string) {
    return this.apollo.use('second')?.query<ProviderInfo>({
      query: queries.getMyConnections,
      fetchPolicy: 'network-only',
      variables: {
        accessToken: accessToken
      },
    })
  }
  submitRejectConnectionRequest(args: any) {
    return this.apollo.use('second').mutate<any>({
      mutation: mutations.submitRejectConnectionRequest,
      variables: args,
    }).pipe(map((data: any) => data))
  }
  sendRejectConnectionRequestMail(args: any) {
    return this.apollo.use('second').mutate<any>({
      mutation: mutations.sendRejectConnectionRequestMail,
      variables: args,
    }).pipe(map((data: any) => data))
  }
  
  getLocationCityConnections(token) {
    const subscription = this.apollo.use('second')?.query<ProviderInfo>({
      query: queries.getUserRecommendedConnectionsCities,
      variables: {
        accessToken: token
      },
      fetchPolicy: 'network-only'
    });
    return subscription;
  }
  notificationsList(targetId: string) {
    const id = targetId
    const subscription = this.apollo.use('second').query<ProviderInfo>({
      query: queries.notificationsList,
      variables: {
        targetId: id
      },
     // fetchPolicy: 'network-only'
    });
    return subscription;
  }
  getLocationStateConnections(token) {
    const subscription = this.apollo.use('second').query<ProviderInfo>({
      query: queries.getUserRecommendedConnectionsStates,
      variables: {
        accessToken: token
      },
      fetchPolicy: 'network-only'
    });
    return subscription;
  }
  submitCancelConnection(args: any) {
    return this.apollo.use('second').mutate<any>({
      mutation: mutations.submitCancelConnection,
      variables: args,
    }).pipe(map((data: any) => data))
  }
  updateNotificationStatus(token: string, pocnUserId: string) {
    return this.apollo.use('second').mutate<any>({
      mutation: mutations.updateNotificationStatus,
      variables: {'accessToken':token, 'pocnUserId':pocnUserId },
    }).pipe(map((data: any) => data))
  }
  getPatientContactDetailConfirmed(accessToken: string){
    return this.apollo.use('second')?.query<ProviderInfo>({
      query: queries.getUserContactDetailConfirmed,
      fetchPolicy: 'network-only',
      variables: {
        accessToken: accessToken
      },
    })
  }
  getPocnP2PConnections(userUniqueId: any) {
    const subscription = this.apollo.query<ProviderInfo>({
       query: queries.providerUserInfos,
       variables:{userUniqueId : userUniqueId} ,
       fetchPolicy: 'network-only'
     });
     return subscription;
   }
   getWorkHistoryConnections(userId) {
     return this.apollo.use('second')?.query<ProviderInfo>({
       query: queries.getUserRecommendedConnectionsWorkhistories,
       variables: {
         accessToken: userId
       },
       fetchPolicy: 'network-only'
     });
   }
   getEducationConnections(userId) {
     return this.apollo.use('second')?.query<ProviderInfo>({
       query: queries.getUserRecommendedConnectionsEducations,
       variables: {
         accessToken: userId
       },
       fetchPolicy: 'network-only'
     });
   }
  providerUserInfos(npi: string) {
    const subscription = this.apollo.query<any>({
      query: queries.providerUserInfos,
      variables: {
        npi : npi
      },
      fetchPolicy: 'network-only'
    });
    return subscription;
  }
  pocnUserListInfos() {
    const subscription = this.apollo.query<any>({
      query: queries.providerUserInfos,
      fetchPolicy: 'network-only'
    });
    return subscription;
  }

  getDialerCaller(accessToken: string){
    return this.apollo.use('second')?.query<ProviderInfo>({
      query: queries.getDialerCaller,
      fetchPolicy: 'network-only',
      variables: {
        accessToken: accessToken
      },
    })
  }
  submitRemoveRecommendedConnection(args: any) {
    return this.apollo.use('second').mutate<any>({
      mutation: mutations.submitRemoveRecommendedConnection,
      variables: args,
    }).pipe(map((data: any) => data))
  }
  createFollower(args: any) {
    return this.apollo.use('second').mutate<any>({
      mutation: mutations.createFollower,
      variables: args,
    }).pipe(map((data: any) => data))
  }
  unfollowUser(args: any) {
    return this.apollo.use('second').mutate<any>({
      mutation: mutations.unfollowUser,
      variables: args,
    }).pipe(map((data: any) => data))

  }
  userFollowsList(filter) {
    return this.apollo.use('second')?.query<ProviderInfo>({
      query: queries.userFollowsList,
      variables: filter,
      fetchPolicy: 'network-only'
    });
}
getUserConnectionExist(token,targetId) {
  const subscription = this.apollo.use('second')?.query<ProviderInfo>({
    query: queries.getUserConnectionExist,
    variables: {
      accessToken: token,
      targetUserId: targetId
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getUserConnectionRequestExist(token,targetId) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.getUserConnectionRequestExist,
    variables: {
      accessToken: token,
      targetUserId: targetId
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
updateCallerProfileDetails(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.addCallerProfile,
    variables: args,
  }).pipe(map((data: any) => data))
}
providerUserCallerData(emailId: string) {
  const subscription = this.apollo.query<any>({
    query: queries.providerUserInfos,
    variables: {
      emailId : emailId
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getRegisteredUsersConnection(token,searchText,pageNumber,itemsPerPage) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.getRegisteredUsersConnection,
    variables: {
      accessToken: token,
      searchText: searchText,
      pageNumber: pageNumber,
      itemsPerPage: itemsPerPage
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getMdmUsersConnection(token,searchText,pageNumber,itemsPerPage) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.getMdmUsersConnection,
    variables: {
      accessToken: token,
      searchText: searchText,
      pageNumber: pageNumber,
      itemsPerPage: itemsPerPage
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}

submitBaaSign(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.submitBaaSign,
    variables: args,
  }).pipe(map((data: any) => data))
}
sendBaaEmail(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.sendBaaEmail,
    variables: args,
  }).pipe(map((data: any) => data))
}
getPatientStages(accessToken: string){
  return this.apollo.use('second').query<ProviderInfo>({
    query: queries.getPatientStages,
    fetchPolicy: 'network-only',
    variables: {
      accessToken: accessToken
    },
  })
}
submitEmailVerification(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.submitEmailVerification,
    variables: args,
  }).pipe(map((data: any) => data))
}
submitEmailConfirm(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.submitEmailConfirm,
    variables: args,
  }).pipe(map((data: any) => data))
}
resendVerificationCode(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.resendVerificationCode,
    variables: args,
  }).pipe(map((data: any) => data))
}
getConnectionsCount(token,userId) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.getConnectionsCount,
    variables: {
      accessToken: token,
      userId: userId
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
submitHcpVerificationConsent(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.submitHcpVerificationConsent,
    variables: args,
  }).pipe(map((data: any) => data))
}
submitHcpElectronicVerification(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.submitHcpElectronicVerification,
    variables: args,
  }).pipe(map((data: any) => data))
}
submitUploadHcp(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.submitUploadHcp,
    variables: args,
  }).pipe(map((data: any) => data))
}
sendManualUploadVerificationEmail(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.sendManualUploadVerificationEmail,
    variables: args,
  }).pipe(map((data: any) => data))
}
submitPhoneLinking(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.submitPhoneLinking,
    variables: args,
  }).pipe(map((data: any) => data))
}
getMdmUserProfile(token,providerId) {
  const subscription = this.apollo.use('second')?.query<ProviderInfo>({
    query: queries.getMdmUserProfile,
    variables: {
      accessToken: token,
      providerId: providerId
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
updatePatientConnectStatus(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updatePatientConnectStatus,
    variables: args,
  }).pipe(map((data: any) => data))
}
patientConnectHcpVerifications(npi: string) {
  const subscription = this.apollo.use('second').query<any>({
    query: queries.patientConnectHcpVerifications,
    variables: {
      npi : npi
    },
    fetchPolicy: 'network-only'
  });
  return subscription;

}
getPatientContact(accessToken: string) {
  const subscription = this.apollo.use('second').query<any>({
    query: queries.getPatientContact,
    variables: {
      accessToken : accessToken
    },
    fetchPolicy: 'network-only'
  });
  return subscription;

}

createGroup(args: any,token:string) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.createGroup,
    variables: { 'groupInput':args,'accessToken':token },
  }).pipe(map((data: any) => data))
}
approveGroupJoinRequest(args: any,token:string) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.approveGroupJoinRequest,
    variables: { 'actionType':args.actionType, 'groupId':args.groupId, 'requestedUserId':args.requestedUserId, 'accessToken':token },
  }).pipe(map((data: any) => data))
}
joinGroup(args: any,token:string) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.joinGroup,
    variables: { 'groupInput':args,'accessToken':token },
  }).pipe(map((data: any) => data))
}
deleteGroup(groupId:string,token:string) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.deleteGroup,
    variables: {'accessToken':token ,'groupId':groupId},
  }).pipe(map((data: any) => data))
}
updateGroup(groupId:string,token:string,groupInput:any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateGroup,
    variables: {'accessToken':token ,'groupId':groupId,'groupInput':groupInput},
  }).pipe(map((data: any) => data))
}
getUserGroups(accessToken: string) {
  const subscription = this.apollo.use('second')?.query<any>({
    query: queries.getUserGroups,
    variables: {
      accessToken : accessToken
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getUserGroupDetail(accessToken: string, groupId: any) {
  const subscription = this.apollo.use('second')?.query<any>({
    query: queries.getUserGroupDetail,
    variables: {
      accessToken : accessToken,
      groupId: groupId
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
groupMembersLists(groupId: String) {
  const subscription = this.apollo.use('second')?.query<any>({
    query: queries.groupMembersLists,
    variables: {
      groupId: groupId
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
myPendingGroupJoinRequests(memberUserId: String) {
  const subscription = this.apollo.use('second').query<any>({
    query: queries.myPendingGroupJoinRequests,
    variables: {
      memberUserId: memberUserId
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
groupJoinRequestsPendingToApprove(token:string) {
  const subscription = this.apollo.use('second').query<any>({
    query: queries.groupJoinRequestsPendingToApprove,
    variables: {
      accessToken: token
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getUserRecommendedGroupsSpecialty(accessToken: string) {
  return this.apollo.use('second').query<any>({
    query: queries.groupRecommendationBySpecialty,
    fetchPolicy: 'network-only',
    variables: {
      accessToken: accessToken
    },
  })
}
groupRecommendationByType(accessToken: string) {
  return this.apollo.use('second').query<any>({
    query: queries.groupRecommendationByType,
    fetchPolicy: 'network-only',
    variables: {
      accessToken: accessToken
    },
  })
}
withdrawGroupJoinRequest(token:string , groupId:string, type:string, ipAddressV4:any,ipAddressV6:any,device:any,channel:any,
  geoLocation:any){
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.withdrawGroupJoinRequest,
    variables: {'accessToken':token ,
    'groupId':groupId,
    'type':type,
    'ipAddressV4':ipAddressV4,
    'ipAddressV6':ipAddressV6,
    'device':device,
    'channel':channel,
    'geoLocation':geoLocation},
  }).pipe(map((data: any) => data))
}

getMyPendingConnections(accessToken:string) {
  const subscription = this.apollo.use('second')?.query<ProviderInfo>({
    query: queries.getMyPendingConnections,
    variables: {
      accessToken:accessToken
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
withdrawConnectionRequest(token:string, npi,ipAddressV4,ipAddressV6,device,channel,geoLocation){
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.withdrawConnectionRequest,
    variables: {'accessToken':token ,'targetNpi':npi
    ,'ipAddressV4':ipAddressV4,'ipAddressV6':ipAddressV6,'channel':channel,'device':device,'geoLocation':geoLocation},
  }).pipe(map((data: any) => data))
}
updateCallerContactPhone(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateCallerContactPhone,
    variables: args,
  }).pipe(map((data: any) => data))
}
updateCallerContactEmail(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateCallerContactEmail,
    variables: args,
  }).pipe(map((data: any) => data))
}
filterGroup(token,searchText) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.filterGroup,
    variables: {
      accessToken: token,
      searchText: searchText
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
removeCallerId(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.removeCallerId,
    variables: args,
  }).pipe(map((data: any) => data))
}
providerMdmUserInfos(providerId) {
  const subscription = this.apollo.query<any>({
    query: queries.providerMdmUserInfos,
    variables: {
      providerId : providerId
    },
    fetchPolicy: 'network-only'
    });
 return subscription;

}
providerMdmInfos(npi) {
  const subscription = this.apollo.query<any>({
    query: queries.providerMdmUserInfos,
    variables: {
      npi : npi
    },
    fetchPolicy: 'network-only'
    });
 return subscription;

}
getMdmUserConnectionRequestExist(token,targetId,targetNpi) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.getUserConnectionRequestExist,
    variables: {
      accessToken: token,
      targetUserId: targetId,
      targetNpi: targetNpi,
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}

patientConnectStatusCalls(userId) {
  const subscription = this.apollo.use('second')?.query<any>({
    query: queries.patientConnectStatusCalls,
    variables: {
      userId : userId
    },
    fetchPolicy: 'network-only'
    });
 return subscription;

}
getProviderInfoNpi(npi: any) {
  const subscription = this.apollo.query<ProviderInfo>({
    query: queries.providerInfoNpi,
    variables: {
      npi : npi
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getProviderInfoCity(filter: any) {
  const subscription = this.apollo.query<ProviderInfo>({
    query: queries.getProviderInfoCity,
    variables: filter,
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getHcoListSearch(hcoName: any) {
  const subscription = this.apollo.query<ProviderInfo>({
    query: queries.getHcoListSearch,
    variables: {
      hcoName : hcoName
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getEducationSearch(hcoName: any){
  const subscription = this.apollo.query<ProviderInfo>({
    query: queries.getEducationSearch,
    variables: {
      hcoName : hcoName
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
forgotPasswordApi(username: string,domain: string) {
  return this.apollo.mutate<any>({
    mutation: mutations.forgotPasswordApi,
    variables: {
      email:username,
      domain:domain
    },
  }).pipe(map((data: any) => data))
}

getResetPassword(emailToken: string) {
  return this.apollo.mutate<any>({
    mutation: mutations.getResetPassword,
    variables: {
      token:emailToken
    },
  }).pipe(map((data: any) => data))

}
updatePassword(emailToken: string, password: string, ipAddressV4:string, ipAddressV6:string, channel:string, device:string, geoLocation:string) {
  return this.apollo.mutate<any>({
    mutation: mutations.updatePassword,
    variables: {
      token:emailToken,
      password: password,
      ipAddressV4:ipAddressV4,
      ipAddressV6:ipAddressV6,
      channel:channel,
      device:device,
      geoLocation:geoLocation,
    },
  }).pipe(map((data: any) => data))
}
verifyUserWelcome(emailToken: string) {
  return this.apollo.mutate<any>({
    mutation: mutations.verifyUserWelcome,
    variables: {
      token:emailToken
    },
  }).pipe(map((data: any) => data))

}
sendParticipantEmail(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.sendParticipantEmail,
    variables: args,
  }).pipe(map((data: any) => data))
}
createRoom(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.createRoom,
    variables: args,
  }).pipe(map((data: any) => data))
}
addParticipant(args:any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.addParticipant,
    variables: args,
  }).pipe(map((data: any) => data))
}
deleteChatRoom(args:any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.deleteChatRoom,
    variables: args,
  }).pipe(map((data: any) => data))
}
validatePhoneNumber(args:any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.validatePhoneNumber,
    variables: args,
  }).pipe(map((data: any) => data))
}
getPocnUserRecommendations(accessToken: string) {
  return this.apollo.use('second')?.query<ProviderInfo>({
    query: queries.getPocnUserRecommendations,
    fetchPolicy: 'network-only',
    variables: {
      accessToken: accessToken
    },
  })
}
validateWorkEmail(args:any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.validateWorkEmail,
    variables: args,
  }).pipe(map((data: any) => data))
}
createPost(args:any){
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.createPost,
    variables: args,
    // update(cache, result) {
    //   // Update the cache as an approximation of server-side mutation effects.
    //   },
    //   refetchQueries: [
    //       { query: queries.pocnPosts }
    //     ],
  }).pipe(map((data: any) => data))
}
userLogs(userId:string) {
  const subscription = this.apollo.use('second').query<any>({
    query: queries.userLogs,
    variables: {
      userId: userId
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
masterDocumentTypes() {
  const subscription = this.apollo.query<any>({
    query: queries.masterDocumentTypes,
    fetchPolicy: 'network-only'
  });
  return subscription;
}
updateUserFirstName(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateUserFirstName,
    variables: args,
  }).pipe(map((data: any) => data))
}
updateUserLastName(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateUserLastName,
    variables: args,
  }).pipe(map((data: any) => data))
}
updateUserState(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateUserState,
    variables: args,
  }).pipe(map((data: any) => data))
}
updateUserCity(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateUserCity,
    variables: args,
  }).pipe(map((data: any) => data))
}
updateUserDegreeCodeText(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateUserDegreeCodeText,
    variables: args,
  }).pipe(map((data: any) => data))
}
updateUserZip(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateUserZip,
    variables: args,
  }).pipe(map((data: any) => data))
}
updateUserFax(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateUserFax,
    variables: args,
  }).pipe(map((data: any) => data))
}
updateUserPhoneNumber(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateUserPhoneNumber,
    variables: args,
  }).pipe(map((data: any) => data))
}
updateUserMobileNumber(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateUserMobileNumber,
    variables: args,
  }).pipe(map((data: any) => data))
}
updateUserTagline(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateUserTagline,
    variables: args,
  }).pipe(map((data: any) => data))
}
pocnPosts() {
  const subscription = this.apollo.use('second').query<any>({
    query: queries.pocnPosts,
    fetchPolicy: 'network-only'
   // fetchPolicy: 'cache-and-network',
  });
  return subscription;
}
pocnRefetchPosts() {
  const subscription = this.apollo.use('second').query<any>({
    query: queries.pocnRefetchPosts,
    fetchPolicy: 'network-only'
   // fetchPolicy: 'cache-and-network',
  });
  return subscription;
  }
  pocnLimitedPost(token: String, limit: Number) {

  const subscription = this.apollo.use('second').query<any>({
    query: queries.getPost,
    fetchPolicy: 'network-only',
    variables: {
      accessToken:token,
      limit: limit
    },
  });
  return subscription;
}
pocnLimitedUserPost(token: String, limit: Number) {

  const subscription = this.apollo.use('second')?.query<any>({
    query: queries.getUserPost,
    fetchPolicy: 'network-only',
    variables: {
      accessToken:token,
      limit: limit
    },
  });
  return subscription;
}
getDetailPocnPosts(postId:string){
  console.log(postId)
  const subscription = this.apollo.use('second').query<any>({
    query: queries.getDetailPocnPosts,
    variables: {
      postId: postId
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
sharePost(args:any){
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.sharePost,
    variables: args,
  }).pipe(map((data: any) => data))
}
updateUserPrimarySpecialty(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateUserPrimarySpecialty,
    variables: args,
  }).pipe(map((data: any) => data))
}
getUserFirstName(accessToken:string) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.getUserFirstName,
    variables: {
      accessToken:accessToken
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getUserLastName(accessToken:string) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.getUserLastName,
    variables: {
      accessToken:accessToken
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getUserTagline(accessToken:string) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.getUserTagline,
    variables: {
      accessToken:accessToken
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getUserState(accessToken:string) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.getUserState,
    variables: {
      accessToken:accessToken
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getUserCity(accessToken:string) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.getUserCity,
    variables: {
      accessToken:accessToken
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getUserDegreeCodeText(accessToken:string) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.getUserDegreeCodeText,
    variables: {
      accessToken:accessToken
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getUserZip(accessToken:string) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.getUserZip,
    variables: {
      accessToken:accessToken
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getUserFaxNumber(accessToken:string) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.getUserFaxNumber,
    variables: {
      accessToken:accessToken
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getUserPhoneNumber(accessToken:string) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.getUserPhoneNumber,
    variables: {
      accessToken:accessToken
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getUserMobileNumber(accessToken:string) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.getUserMobileNumber,
    variables: {
      accessToken:accessToken
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
submitCallerId(args:any){
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.submitCallerId,
    variables: args,
  }).pipe(map((data: any) => data))
}
deletePost(args:any){
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.deletePost,
    variables: args,
  }).pipe(map((data: any) => data))
}
updateUserLinkedin(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateUserLinkedin,
    variables: args,
  }).pipe(map((data: any) => data))
}
updateUserFbProfile(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateUserFbProfile,
    variables: args,
  }).pipe(map((data: any) => data))
}
updateUserTwitterProfile(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateUserTwitterProfile,
    variables: args,
  }).pipe(map((data: any) => data))
}
updateUserWebsite(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateUserWebsite,
    variables: args,
  }).pipe(map((data: any) => data))
}
getUserTwitterProfile(accessToken:string) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.getUserTwitterProfile,
    variables: {
      accessToken:accessToken
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getUserFbProfile(accessToken:string) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.getUserFbProfile,
    variables: {
      accessToken:accessToken
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getUserLinkedinProfile(accessToken:string) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.getUserLinkedinProfile,
    variables: {
      accessToken:accessToken
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getUserWebsite(accessToken:string) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.getUserWebsite,
    variables: {
      accessToken:accessToken
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
likePost(args:any){
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.likePost,
    variables: args,
    // update(cache, result) {
    //   // Update the cache as an approximation of server-side mutation effects.
    //   },
    //   refetchQueries: [
    //       { query: queries.pocnRefetchPosts }
    //     ],
  }).pipe(map((data: any) => data))
}
searchPost(args:any){
  return this.apollo.use('second').mutate<any>({
    mutation: queries.searchPost,
    variables: args,
    fetchPolicy: 'network-only'
  }).pipe(map((data: any) => data))
}
userPocnPosts() {
  const subscription = this.apollo.use('second').query<any>({
    query: queries.userPocnPosts,
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getUserConnectionRequest(token,targetId) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.getUserConnectionRequest,
    variables: {
      accessToken: token,
      targetUserId: targetId
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
makeGroupAdmin(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.makeGroupAdmin,
    variables: args,
  }).pipe(map((data: any) => data))
}
removeGroupAdmin(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.removeGroupAdmin,
    variables: args,
  }).pipe(map((data: any) => data))
}
getUserStat(accessToken:string) {
  const subscription = this.apollo.use('second')?.query<ProviderInfo>({
    query: queries.getUserStat,
    variables: {
      accessToken:accessToken
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
inviteUserGroup(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.inviteUserGroup,
    variables: args,
  }).pipe(map((data: any) => data))
}
getUserStatPublicProfile(accessToken:string,userId:string) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.getUserStatPublicProfile,
    variables: {
      accessToken:accessToken,
      userId :userId
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
updateGroupName(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateGroupName,
    variables: args,
  }).pipe(map((data: any) => data))
}
getRegisteredUsersGroup(token,searchText,pageNumber,itemsPerPage,groupId) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.getRegisteredUsersGroup,
    variables: {
      accessToken: token,
      searchText: searchText,
      pageNumber: pageNumber,
      itemsPerPage: itemsPerPage,
      groupId: groupId
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getMdmUsersGroup(token,searchText,pageNumber,itemsPerPage,groupId) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.getMdmUsersGroup,
    variables: {
      accessToken: token,
      searchText: searchText,
      pageNumber: pageNumber,
      itemsPerPage: itemsPerPage,
      groupId : groupId
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
updateGroupDescription(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateGroupDescription,
    variables: args,
  }).pipe(map((data: any) => data))
}
updateGroupTags(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateGroupTags,
    variables: args,
  }).pipe(map((data: any) => data))
}
getMySentInvitationRequest(accessToken:string) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.getMySentInvitationRequest,
    variables: {
      accessToken:accessToken
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getMyReceivedInvitationRequest(accessToken:string) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.getMyReceivedInvitationRequest,
    variables: {
      accessToken:accessToken
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
updateGroupSpecialty(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateGroupSpecialty,
    variables: args,
  }).pipe(map((data: any) => data))
}
updateGroupEnrollment(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateGroupEnrollment,
    variables: args,
  }).pipe(map((data: any) => data))
}
updateGroupLocation(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateGroupLocation,
    variables: args,
  }).pipe(map((data: any) => data))
}
updateGroupState(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateGroupState,
    variables: args,
  }).pipe(map((data: any) => data))
}
updateGroupTherapeutics(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateGroupTherapeutics,
    variables: args,
  }).pipe(map((data: any) => data))
}
updateGroupProviderType(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateGroupProviderType,
    variables: args,
  }).pipe(map((data: any) => data))
}
acceptInvitationRequest(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.acceptInvitationRequest,
    variables: args,
  }).pipe(map((data: any) => data))
}
rejectInvitationRequest(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.rejectInvitationRequest,
    variables: args,
  }).pipe(map((data: any) => data))
}
withdrawSentInvitationRequest(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.withdrawSentInvitationRequest,
    variables: args,
  }).pipe(map((data: any) => data))
}
pocnGroupPosts(groupUuid:string) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.pocnGroupPosts,
    variables: {
      groupUuid:groupUuid,
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getUserGroupRequestStatus(accessToken:string, groupId:string) {
  const subscription = this.apollo.use('second')?.query<ProviderInfo>({
    query: queries.getUserGroupRequestStatus,
    variables: {
      accessToken:accessToken,
      groupId: groupId
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
searchPostGroup(args:any){
  return this.apollo.use('second').mutate<any>({
    mutation: queries.searchPostGroup,
    variables: args,
    fetchPolicy: 'network-only'
  }).pipe(map((data: any) => data))
}
removeMemberGroup(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.removeMemberGroup,
    variables: args,
  }).pipe(map((data: any) => data))
}
makeGroupOwner(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.makeGroupOwner,
    variables: args,
  }).pipe(map((data: any) => data))
}
updateGroupMemberInvite(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateGroupMemberInvite,
    variables: args,
  }).pipe(map((data: any) => data))
}
updateGroupBannerImage(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateGroupBannerImage,
    variables: args,
  }).pipe(map((data: any) => data))
}
relatedGroups(accessToken:string,groupId :string) {
  const subscription = this.apollo.use('second')?.query<ProviderInfo>({
    query: queries.relatedGroups,
    variables: {
      accessToken:accessToken,
      groupId:groupId
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
groupRecommendationByTa(accessToken:string) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.groupRecommendationByTa,
    variables: {
      accessToken:accessToken
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
groupRecommendationByLocation(accessToken:string) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.groupRecommendationByLocation,
    variables: {
      accessToken:accessToken
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
groupRecommendationByName(accessToken:string) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.groupRecommendationByName,
    variables: {
      accessToken:accessToken
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
groupRecommendationByTags(accessToken:string) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.groupRecommendationByTags,
    variables: {
      accessToken:accessToken
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
groupRecommendationByPocn(accessToken:string) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.groupRecommendationByPocn,
    variables: {
      accessToken:accessToken
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getUserPost(accessToken:string) {
  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.getUserPost,
    variables: {
      accessToken:accessToken
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getUserGroupMemberCheck(accessToken:string,groupId :string) {
  console.log("hii");

  const subscription = this.apollo.use('second').query<ProviderInfo>({
    query: queries.getUserGroupMemberCheck,
    variables: {
      accessToken:accessToken,
      groupId:groupId
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}

getUserMyPost(token: String, limit: Number) {
  const subscription = this.apollo.use('second').query<any>({
    query: queries.getUserMyPost,
    variables: {
      accessToken:token,
      limit: limit
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getConnectionMyPost(token: String, limit: Number) {
  const subscription = this.apollo.use('second').query<any>({
    query: queries.getConnectionMyPost,
    variables: {
      accessToken:token,
      limit: limit
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getPublishMyPost(token: String, limit: Number) {
  const subscription = this.apollo.use('second').query<any>({
    query: queries.getPublishMyPost,
    variables: {
      accessToken:token,
      limit: limit
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getGroupMyPost(token: String, limit: Number) {
  const subscription = this.apollo.use('second').query<any>({
    query: queries.getGroupMyPost,
    variables: {
      accessToken:token,
      limit: limit
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getOtherMyPost(token: String, limit: Number) {
  const subscription = this.apollo.use('second').query<any>({
    query: queries.getOtherMyPost,
    variables: {
      accessToken:token,
      limit: limit
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
// getPostUserSearch(args:String){
//   console.log(args)
//   return  this.apollo.query<any>({
//     query: queries.getPostUserSearch,
//     variables:{
//       searchText:args,
//     },
//     fetchPolicy: 'network-only'
//   }).pipe(map((data: any) => data))
// }
getPostUserSearch(token,searchText,pageNumber,itemsPerPage) {
  const subscription = this.apollo.use('second')?.query<ProviderInfo>({
    query: queries.getPostUserSearch,
    variables: {
      accessToken: token,
      searchText: searchText,
      pageNumber: pageNumber,
      itemsPerPage: itemsPerPage
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getPostGroupSearch(searchText:String, token:String) {
  console.log(searchText)

  const subscription = this.apollo.use('second')?.query<ProviderInfo>({
    query: queries.getPostGroupSearch,
    variables: {
      accessToken:token,
      searchText:searchText

    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getGroupPosts(groupId:String, token:String) {
  console.log(groupId)

  const subscription = this.apollo.use('second')?.query<ProviderInfo>({
    query: queries.getGroupPosts,
    variables: {
      accessToken:token,
      groupId:groupId

    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getDefaultPost(token:String) {
  const subscription = this.apollo.use('second')?.query<ProviderInfo>({
    query: queries.getDefaultPost,
    variables: {
      accessToken:token,
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getUserShareGroups(accessToken: string, sortOrder: string) {
  const subscription = this.apollo.use('second')?.query<any>({
    query: queries.getUserShareGroups,
    variables: {
      accessToken : accessToken,
      sortAlphabet : sortOrder
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
getMyConnectionsRequestNotification(accessToken:string) {
  const subscription = this.apollo.use('second')?.query<ProviderInfo>({
    query: queries.getMyConnectionsRequestNotification,
    variables: {
      accessToken:accessToken
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
updateMyConnectionsRequestNotification(accessToken:string) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateMyConnectionsRequestNotification,
    variables: {
      accessToken:accessToken
    },
  }).pipe(map((data: any) => data))
}
getIpAddress(){
  let v4:any; 
  let v6:any; 
  this.httpClient.get('https://ipv4.jsonip.com').subscribe((value: any) => {
      v4 = value.ip;
    },(error) => {}
  );
  this.httpClient.get('https://ipv6.jsonip.com').subscribe((value: any) => {
      v6 = value.ip;
    },(error) => {}
  );
  setTimeout(() => { 
    if(v4 === v6){
      if (v4.includes(":")) {
        this.pocnLocalStorageManager.saveData("ipv6",v6);       
        this.pocnLocalStorageManager.saveData("ipv4",'');       
      } else {
        this.pocnLocalStorageManager.saveData("ipv4",v4);    
        this.pocnLocalStorageManager.saveData("ipv6",'');    
      }
    }
  }, 5000);
}
getTelephoneCountryCode(accessToken:string) {
  const subscription = this.apollo.use('second')?.query<ProviderInfo>({
    query: queries.getTelephoneCountryCode,
    variables: {
      accessToken:accessToken
    },
    fetchPolicy: 'network-only'
  });
  return subscription;
}
updateUserLog(args: any) {
  return this.apollo.use('second').mutate<any>({
    mutation: mutations.updateUserLog,
    variables: args,
  }).pipe(map((data: any) => data))
}

sendNpiLookupFailureNotification(args:any) {
  return this.apollo.mutate<any>({
    mutation: mutations.sendNpiLookupFailureNotification,
    variables: args,
  }).pipe(map((data: any) => data))
}
}

