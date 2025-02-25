import Dexie, { Table } from "dexie";

// Below are formsflow.ai specific interfaces
// These define the structure of various objects stored in IndexedDB

interface FormDefinisionList {
  id: string;
  formId: string;
  formName: string;
  formType: string;
  processKey: string;
  modified: string;
}

interface FormListMetaData {
  key: string;
  totalCount: number;
  pageNo: number;
  limit: number;
}

interface Application {
  id: number;
  applicationName: string;
  applicationStatus: string;
  created: string;
  createdBy: string;
  eventName: string;
  formId: string;
  formProcessMapperId: string;
  formType: string;
  isResubmit: boolean;
  modified: string;
  modifiedBy: string;
  processInstanceId: string;
  processKey: string;
  processName: string;
  processTenant: string;
  submissionId: string;
}

interface ApplicationMetaData {
  key: string;
  draftCount: number;
  totalCount: number;
  pageNo: number;
  limit: number;
}

interface DraftMetaData {
  key: string;
  totalCount: number;
  applicationCount: number;
}

interface SubmissionData {
  owner: string;
  access: any[];
  externalIds: any[];
  roles: any[];
  metadata: Record<string, any>;
}

// brought localDraftId and localSubmissionId here because,
//  Dexie does not allow indexes on nested properties like submissionData.localSubmissionId
interface OfflineSubmission {
  _id: string;
  formId: string; // the same for draft and submission
  data: Record<string, any>; // the same for draft and submission
  draftData: DraftData;
  submissionData: SubmissionData;
  localSubmissionId?: string;
  created: string; // the same for draft and submission
  modified: string; // the same for draft and submission
  type: string;
  localApplicationId: string; // local generated
  localDraftId: string; // local generated
  serverDraftId: string; // Server Draft id generated
  serverApplicationId: string; // Server Draft id generated
}

interface DraftData {
  CreatedBy: string;
  DraftName: string;
  formType: string;
  processKey: string;
  processName: string;
}

// Database class extending Dexie to manage IndexedDB storage
class FormsFlowDB extends Dexie {
  // Declaring tables with their respective interfaces
  formDefinitionList!: Table<FormDefinisionList>;
  formListMetaData!: Table<FormListMetaData>;
  applications!: Table<Application>;
  applicationMetaData!: Table<ApplicationMetaData>;
  // drafts!: Table<Draft>;
  draftMetaData!: Table<DraftMetaData>;
  offlineSubmissions!: Table<OfflineSubmission>;

  constructor() {
    super("formsflowTables");

    // Database schema definitions
    //if you need to change any of these definitions add a new version below instead of changing the current one. If there is a change that
    //requires a migration you need to add a .upgrade(() => {}) to the end of the version to handle how the data is migrated.

    this.version(1).stores({
      formDefinitionList:
        "id, formId, formName, formType, processKey, modified",
      formListMetaData: "key",
      applications: "id, formId, submissionId",
      applicationMetaData: "key",
      drafts: "id, applicationId, formId",
      draftMetaData: "key",
      offlineSubmissions: "_id, formId, type, localSubmissionId, localDraftId",
    });
  }
}

// Initialize the database
export const ffDb = new FormsFlowDB();

// Open the database and clear formID for testing
const initDB = async () => {
  try {
    if (!ffDb.isOpen()) {
      await ffDb.open();
      console.log("IndexedDB is open.");
    } else {
      console.log("IndexedDB is already open.");
    }
  } catch (error) {
    console.error("Open failed: " + error);
  }
};

initDB();
