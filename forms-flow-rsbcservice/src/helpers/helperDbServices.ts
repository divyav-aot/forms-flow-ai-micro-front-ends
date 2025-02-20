import { StorageService } from "@formsflow/service";

export const generateGUID = () => crypto.randomUUID();


export const getUserDetails = () => {
  return JSON.parse(StorageService.get(StorageService.User.USER_DETAILS))
}

const constructSubmissionDataObject = (submission: any) => {
  const userDetails = getUserDetails();  
  return {    
    metadata: submission?.metadata,
    owner: userDetails?.email,
    externalIds: [],
    roles: [],
    access: []
  };
}

export const constructOfflineSubmissionData = (submission: any, formId: string) => {
  const submissionData = constructSubmissionDataObject(submission);
  const _id = generateGUID();
  const submissionId = generateGUID();
  const now = new Date().toISOString();
  return {
    _id: _id,
    localSubmissionId: submissionId,
    submissionData: submissionData,
    draftData: {},
    created: now,
    modified: now,
    data: submission?.data,
    formId: formId,
    type: "application"
  };
}

export const constructApplicationData = (formId: string, submissionId: string, formData: any) => {
  const userDetails = getUserDetails();
  const randomId = Math.floor(Math.random() * 1000000000); // Generate a random number
  const now = new Date().toISOString(); // Current datetime in ISO format

  return {
    applicationName: formData?.title,
    applicationStatus: "In Progress",
    created: now,
    createdBy: userDetails?.preferred_username || "Unknown User",
    eventName: null,
    formId: formId,
    formProcessMapperId: null,
    formType: "form",
    id: randomId,
    isClientEdit: false,
    isResubmit: false,
    modified: now,
    modifiedBy: null,
    processInstanceId: null,
    processKey: null,
    processName: null,
    processTenent: null,
    submissionId: submissionId
  };
};