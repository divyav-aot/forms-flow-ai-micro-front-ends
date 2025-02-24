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

const transformSubmissionData = (submission: any) => {
  try {
    if (!submission || typeof submission !== "object") {
      throw new Error("Invalid submission object");
    }

    const submissionData = submission.submissionData || {};
    
    return {
      access: Array.isArray(submissionData.access) ? submissionData.access : [],
      owner: submissionData.owner || "",
      externalIds: Array.isArray(submissionData.externalIds) ? submissionData.externalIds : [],
      roles: Array.isArray(submissionData.roles) ? submissionData.roles : [],
      metadata: typeof submissionData.metadata === "object" && submissionData.metadata !== null ? submissionData.metadata : {},
      form: submission.formId || "",
      created: submission.created || "",
      modified: submission.modified || "",
      data: submission.data || {},
      _id: submission.localSubmissionId || "",
    };
  } catch (error) {
    console.error("Error in transformSubmissionData:", error);
    return null; // or return an empty object if needed
  }
};

export const transformFinalSubmissionData = (submission: any) => {
  try {
    if (!submission || typeof submission !== "object") {
      throw new Error("Invalid submission object");
    }

    const submissionData = transformSubmissionData(submission);
    
    return {
      submission: submissionData,
      formId: submission.formId || "",
      id: submission.localSubmissionId || "",
      url: "",
      lastUpdated: 0,
      isActive: false,
      error: ""      
    };
  } catch (error) {
    console.error("Error in transformFinalSubmissionData:", error);
    return null; // or return an empty object if needed
  }
};

export const transformFormDefinitionData = (form: any) => {
  try {
    if (!form || typeof form !== "object") {
      throw new Error("Invalid form object");
    }    
    return {
      form: form,
      id: form._id || "",
      url: "",
      lastUpdated: 0,
      isActive: false,
      error: ""      
    };
  } catch (error) {
    console.error("Error in transformFormDefinitionData:", error);
    return null; // or return an empty object if needed
  }
};


