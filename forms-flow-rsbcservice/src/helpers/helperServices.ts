import { StorageService } from "@formsflow/service";

// Error handler function
export const handleError = (error: string) => {
  console.error("Error:", error);
};

export const generateGUID = () => crypto.randomUUID();

export const getUserDetails = () => {
  return JSON.parse(StorageService.get(StorageService.User.USER_DETAILS));
};

export const constructSubmissionData = (submission: any, formId: string) => {
  const userDetails = getUserDetails();
  const submissionId = generateGUID();
  const _id = generateGUID();
  const now = new Date().toISOString();
  return {
    _id: _id,
    submissionId: submissionId,
    created: now,
    modified: now,
    data: submission?.data,
    draftData: "",
    metadata: submission?.metadata,
    formId: formId,
    owner: userDetails?.email,
    externalIds: [],
    roles: [],
    access: [],
    type: "application",
  };
};

export const constructApplicationData = (
  formId: string,
  submissionId: string,
  formData: any
) => {
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
    submissionId: submissionId,
  };
};

export const constructDrafSubmissiontData = (draft: any, formId: string) => {
  const userDetails = getUserDetails();
  const _id = generateGUID();
  const now = new Date().toISOString();
  return {
    _id: _id,
    created: now,
    modified: now,
    data: "",
    draftDrata: draft.data,
    metadata: draft?.metadata,
    formId: formId,
    owner: userDetails?.email,
    externalIds: [],
    roles: [],
    access: [],
    type: "draft",
  };
};

export const constructDraftApplicationData = (
  formId: string,
  applicationId: string,
  draftData: any
) => {
  const userDetails = getUserDetails();
  const randomId = Math.floor(Math.random() * 1000000000); // Generate a random number
  const now = new Date().toISOString(); // Current datetime in ISO format

  return {
    createdBy: userDetails?.preferred_username || "Unknown User",
    draftName: draftData?.DraftName,
    applicationId: applicationId,
    created: now,
    data: draftData.data,
    formId: formId,
    formType: "form",
    id: randomId,
    modified: now,
    processName: draftData.processName,
  };
};
