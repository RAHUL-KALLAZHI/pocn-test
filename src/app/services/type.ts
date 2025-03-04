export interface Person {
    firstName: string;
    lastName: string;
    city:string;
    state: string;
    provideType: string;
    email: string;
    npi: string;
    year: string;
    leadSource: string;
    promoCode: string;
    password: string;
    confirmPassword: string;
}

export interface StateNode {
    id: number;
    statename: string;
    statevalue: string;

}
export interface State {
    nodes: StateNode[];
}
export type States = {
    states: State
}
export type Provider = {
    id: number;
    name: string
}
export type Source = {
    id: string;
    name: string
}

export interface ProvderInfoNode {
    primarySpecialityCode: string;
    firstName: string;
    lastName: string;
    hcpState: string;
    npi: string;
    cbsaName: string;
    hcpType: string;
    hcpLocality: string;
    hcpDegreeGroupCode: string;
}

export interface RefreshSession {
  realm:string;
  refreshToken:string;
 }
export interface ProviderInfos {
    nodes: ProvderInfoNode[]
}
export type ProviderInfo = {
    providerInfos: ProviderInfos
}

export type Year = {
    year: string
}
export interface EmploymentNode {
  id: number;
  name: string;
}
export interface Employment {
  nodes: EmploymentNode[];
}
export type Employments = {
  employmentTypes: Employment
}

export interface UserProfileImage {
    fileContent: string;
    fileName: string;
    imgType: string;
    npi: string;
    providerId: string;
    userId: string;
  }

  export interface UserResume {
    fileContent: string;
    fileName: string;
    npi: string;
    providerId: string;
    userId: string;
  }
  export interface AddressNode {
    id: number;
    name: string;
  }
  export interface Address {
    nodes: AddressNode[];
  }
  export type Addresses = {
    addressTypes: Address
  }
  export interface ContactNode {
    id: number;
    name: string;
  }
  export interface Contact {
    nodes: ContactNode[];
  }
  export type Contacts = {
    contactTypes: Contact
  }

  export interface DegreeNode {
      degreeCode: string;
      degreeGroupCode: string;
      degreeGroupName: string;
      degreeId: number;
      degreeName: string;
  }
  export interface Topic {
    nodes: TopicNode[];
  }
  export type Topics = {
    masterTopics: Topic
  }

  export interface TopicNode {
    id: string;
    title: string;
  }

  export interface LeadSource {
    nodes: LeadSourceNode[];
  }
  export type LeadSources = {
    leadSourceMasters: LeadSource
  }

  export interface LeadSourceNode {
    id: string;
    title: string;
  }

  export interface GeneralTopic {
    nodes: GeneralTopicNode[];
  }
  export type GeneralTopics = {
    masterTopicsGenerals: GeneralTopic
  }

  export interface GeneralTopicNode {
    id: string;
    title: string;
  }

export interface Degree {
  nodes: DegreeNode[];
}
export type Degrees = {
  masterDegrees: Degree
}

  export interface SpecialityNode {
	  specialtyCode: string;
      specialtyGroupCode: string;
      specialtyGroupName: string;
      specialtyId: number;
      specialtyName: string;
  }
  export interface Speciality {
    nodes: SpecialityNode[];
  }
  export type Specialties = {
    masterSpecialties: Speciality
  }
  export interface TherapeuticAreaNode {
	  id: number;
    therapeuticAreas: string;
  }
  export interface TherapeuticArea {
    nodes: TherapeuticAreaNode[];
  }
  export type TherapeuticAreas = {
    getTherapeuticAreasSpecCode: TherapeuticArea
  }
  export interface HcoNode {
      hcoDmcid: number;
      hcoName: string;
      hcoType: string;
  }
  export interface Hco {
    nodes: HcoNode[];
  }
  export type Hcos = {
    hcoMasters: Hco
  }

  export interface educationNode {
    id: number;
    hcoName: string;
    hcoDmcid: number;
  }
  export interface education {
    nodes: educationNode[];
  }
  export type Educations = {
    educationMasters: education;
  }

  export interface ScopeNode {
    scopeId: number;
    scopeTitle: string;
  }
  export interface Scope {
    nodes: ScopeNode[];
  }
  export type Scopes = {
    groupScopMasters: Scope
  }

  export interface RegionalNode {
    regionalId: number;
    title: string;
  }
  export interface Regional {
    nodes: RegionalNode[];
  }
  export type Regionals = {
    regionalMasters: Regional
  }

  export interface DialerCallerData {
    callerId: string;
    name: string;
    npi: string;
    phoneNumber: string;
    providerId: number;
    userId: string;
  }
  export interface DialerCaller {
    data: DialerCallerData[];
  }

  export interface DialerCallers {
    getDialerCaller: DialerCaller;
  }

  export interface DialerCallerHistoryData {
    callEndDate: string;
    callStartDate: string;
    duration: string;
    fromPhone: string;
    historyId: string;
    npi: string;
    providerId: number;
    toPhone: string;
    type: string;
    userId: string;
  }
  export interface DialerCallerHistoryDatas {
    data: DialerCallerHistoryData[];
  }

  export interface DialerCallerHistory {
    getDialerCallerHistory: DialerCallerHistoryDatas;
  }

  export interface ConnectData {
    idData: string;
}
export interface ConnectionResponse {
  updateConnectionResponse: {
    status : string;
    error: string ;
    message: string;
    data: string;
  }
}
export interface ConnectionCallerResponse {
  userProfileUpdateResponse: {
    status : string;
    error: string ;
    message: string;
    data: string;
  }
}
export interface PostResponse {
  postStatusResponse: {
    status : string;
    error: string ;
    message: string;
    data: string;
  }
}
export interface PostLikeResponse {
  postStatusLikeResponse: {
    status : string;
    error: string ;
    message: string;
    totalCount: string;
    likeStatus: string;
  }
}
export interface npiSendResponse {
  npiLookupFailureNotificationResult: {
    status : string;
    error: string ;
    message: string;
  }
}
export type PatientConnectResponse  ={
  data: {
    submitBaaSign:ConnectionResponse
  }
}
export type PatientConnectBaaResponse  ={
  data: {
    sendBaaEmail:ConnectionResponse
  }
}
export type SubmitEmailConfirmResponse  ={
    data: {
      submitEmailConfirm: ConnectionResponse
    }
}
export type SubmitEmailVerificationResponse  ={
  data: {
    submitEmailVerification: ConnectionResponse
  }
}
export type SubmitHcpVerificationConsentResponse  ={
  data: {
    submitHcpVerificationConsent: ConnectionResponse
  }
}
export type SubmitHcpElectronicVerificationResponse  ={
  data: {
    submitHcpElectronicVerification: ConnectionResponse
  }
}
export type SubmitUploadHcpResponse  ={
  data: {
    submitUploadHcp: ConnectionResponse
  }
}
export type SubmitUploadHcpTestResponse  ={
  data: {
    sendManualUploadVerificationEmail: ConnectionResponse
  }
}
export type SubmitPhoneLinkingResponse  ={
  data: {
    submitPhoneLinking: ConnectionResponse
  }
}
export type AddCallerProfileResponse  ={
  data: {
    addCallerProfile: ConnectionCallerResponse
  }
}
export type UpdatePatientConnectStatusResponse  ={
  data: {
    updatePatientConnectStatus: ConnectionResponse
  }
}
export type ResendVerificationCodeResponse  ={
  data: {
    resendVerificationCode: ConnectionResponse
  }
}
export type SendParticipantEmailResponse  ={
  data: {
    sendParticipantEmail: ConnectionResponse
  }
}
export type CreateRoomResponse  ={
  data: {
    createRoom: ConnectionResponse
  }
}
export type AddParticipantResponse  ={
  data: {
    addParticipant: ConnectionResponse
  }
}
export type DeleteChatRoomResponse  ={
  data: {
    deleteChatRoom: ConnectionResponse
  }
}
export type ValidatePhoneNumberResponse  ={
  data: {
    validatePhoneNumber: ConnectionResponse
  }
}
export type ValidateEmailResponse  ={
  data: {
    validateWorkEmail: ConnectionResponse
  }
}
export type CreatePostResponse  ={
  data: {
    createPost: PostResponse
  }
}
export type SharePostResponse  ={
  data: {
    sharePost: PostResponse
  }
}
export type SubmitCallerResponse  ={
  data: {
    submitCallerId: ConnectionResponse
  }
}
export type DeletePostResponse  ={
  data: {
    deletePost: PostResponse
  }
}
export type LikePostResponse  ={
  data: {
    likePost: PostLikeResponse
  }
}

export type npiNotificationResponse  ={
    data: {
      sendNpiLookupFailureNotification:npiSendResponse
    }
}
