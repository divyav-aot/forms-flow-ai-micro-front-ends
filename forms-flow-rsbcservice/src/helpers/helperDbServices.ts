import { StorageService } from "@formsflow/service";

export const generateGUID = () => crypto.randomUUID();

export const getUserDetails = () => {
  return JSON.parse(StorageService.get(StorageService.User.USER_DETAILS));
};

const constructSubmissionDataObject = (submission: any) => {
  const userDetails = getUserDetails();
  return {
    metadata: submission?.metadata,
    owner: userDetails?.email,
    externalIds: [],
    roles: [],
    access: [],
  };
};

export const constructOfflineSubmissionData = (
  submission: any,
  formId: string
) => {
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

export const constructDraftSubmissiontData = (draft: any, formId: string) => {
  const userDetails = getUserDetails();
  const randomDraftId = Math.floor(Math.random() * 1000000000);
  const now = new Date().toISOString();
  return {
    id: randomDraftId,
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

export const constructOfflineSubmissionDraftData = (
  draftData: any,
  generatedDraftId: number
) => {
  const userDetails = getUserDetails();
  const _id = generateGUID();
  const randomApplicationId = Math.floor(Math.random() * 1000000000); // Generate a random number
  const now = new Date().toISOString(); // Current datetime in ISO format

  return {
    _id: _id,
    formId: draftData.formId,
    data: {},
    draftData: constructDraftDataObject(
      draftData?.DraftName,
      userDetails?.preferred_username,
      draftData?.processName
    ),
    submissionData: "",
    localSubmissionId: "",
    created: now,
    modified: now,
    type: "draft",
    localApplicationId: randomApplicationId,
    localDraftId: generatedDraftId,
    serverDraftId: "",
    serverApplicationId: "",
  };
};

const constructDraftDataObject = (
  draftName: string,
  createdBy: string,
  processName: string
) => {
  return {
    DraftName: draftName || "RoadSaftey Digital Forms",
    CreatedBy: createdBy || "Unknown User",
    formType: "form",
    processKey: "",
    processName: processName || "roadSafteyDigitalForms",
  };
};
