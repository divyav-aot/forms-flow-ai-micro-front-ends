import Dexie, { Table } from "dexie";

// Below are RSBC (RoadSafetyBC) specific interfaces
// These define the structure of various objects stored in IndexedDB
interface User {
  user_guid: string;
  business_guid: string;
  username: string;
  agency: string;
  badge_number: string;
  last_name: string;
  first_name: string;
  display_name: string;
  login: string;
}

interface UserRole {
  user_guid: string;
  role_name: string;
  submitted_dt: string;
  approved_dt?: string;
}

interface Vehicle {
  id: string;
  mk: string;
  search: string;
  md: string;
}

interface VehicleStyle {
  code: string;
  name: string;
}

interface VehicleColour {
  code: string;
  display_name: string;
  colour_class: string;
}

interface Province {
  id: string;
  objectCd: string;
  objectDsc: string;
}

interface Jurisdiction {
  id: string;
  objectCd: string;
  objectDsc: string;
}

interface ImpoundLotOperator {
  id: string;
  name: string;
  lot_address: string;
  city: string;
  phone: string;
  name_print: string;
}

interface Country {
  id: string;
  objectCd: string;
  objectDsc: string;
}

interface City {
  id: string;
  objectCd: string;
  objectDsc: string;
}

interface Agency {
  id: string;
  vjur: string;
  agency_name: string;
}

interface FormID {
  id: string;
  form_type: string;
  user_guid: string;
  leased: boolean;
}

interface VehicleType {
  type_cd: string;
  description: string;
}

interface NSCPuj {
  id: string;
  objectCd: string;
  objectDsc: string;
}

interface JurisdictionCountry {
  id: string;
  objectCd: string;
  objectDsc: string;
}

// Below are formsflow.ai specific interfaces

interface FormList {
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

interface Draft {
  id: number;
  applicationId: number;
  formId: string;
  DraftName: string;
  created: string;
  modified: string;
  data: Record<string, any>; // Since the structure varies, we use a generic key-value object
  CreatedBy: string;
  processName: string;
  formType: string;
}

interface DraftMetaData {
  key: string;
  totalCount: number;
  applicationCount: number;
}

interface OfflineSubmission {
  _id: string;
  formId: string;
  submissionId: string;
  data: Record<string, any>;
  metadata: Record<string, any>;
  created: string;
  modified: string;
  owner: string;
  access: string;
  externalIds: string;
  roles: string;
  draftId: string;
  draftidorigin: string;
  type: string;
}

// Database class extending Dexie to manage IndexedDB storage
class DigitalFormsDB extends Dexie {
  // Declaring tables with their respective interfaces
  user!: Table<User>;
  userRoles!: Table<UserRole>;
  vehicles!: Table<Vehicle>;
  vehicleStyles!: Table<VehicleStyle>;
  vehicleColours!: Table<VehicleColour>;
  provinces!: Table<Province>;
  jurisdictions!: Table<Jurisdiction>;
  impoundLotOperators!: Table<ImpoundLotOperator>;
  countries!: Table<Country>;
  cities!: Table<City>;
  agencies!: Table<Agency>;
  // event!: Table<Event>;
  formID!: Table<FormID>;
  vehicleTypes!: Table<VehicleType>;
  nscPuj!: Table<NSCPuj>;
  jurisdictionCountry!: Table<JurisdictionCountry>;
  // incompleteEvent!: Table<IncompleteEvent>;
  formList!: Table<FormList>;
  formListMetaData!: Table<FormListMetaData>;
  application!: Table<Application>;
  applicationMetaData!: Table<ApplicationMetaData>;
  draft!: Table<Draft>;
  draftMetaData!: Table<DraftMetaData>;
  offlineSubmission!: Table<OfflineSubmission>

  constructor() {
    super("digitalForms");

    // Database schema definitions
    //if you need to change any of these definitions add a new version below instead of changing the current one. If there is a change that
    //requires a migration you need to add a .upgrade(() => {}) to the end of the version to handle how the data is migrated.

    this.version(1).stores({
      formList: "id, formId, formName, formType, processKey, modified",
      formListMetaData: "key",
      application: "id, formId, submissionId",
      applicationMetaData: "key",
      draft: "id, applicationId, formId",
      draftMetaData:"key",
      offlineSubmission: "_id, formId, submissionId, draftId, type, draftidorigin",

    });

    this.version(3).stores({
      user: "user_guid, business_guid, username, agency, badge_number, last_name, first_name, display_name, login",
      userRoles:
        "[user_guid+role_name], user_guid, role_name, submitted_dt, approved_dt",
      vehicles: "id, mk, search, md",
      vehicleStyles: "code, name",
      vehicleColours: "code, display_name, colour_class",
      provinces: "id, objectCd, objectDsc",
      jurisdictions: "id, objectCd, objectDsc",
      impoundLotOperators: "id, name, lot_address, city, phone, name_print",
      countries: "id, objectCd, objectDsc",
      cities: "id, objectCd, objectDsc",
      agencies: "id, vjur, agency_name",
      formID: "id, form_type, user_guid, leased, [form_type+leased]",
      vehicleTypes: "type_cd, description",
    });

    this.version(4).stores({
      nscPuj: "id, objectCd, objectDsc",
      jurisdictionCountry: "id, objectCd, objectDsc",
    });
  }
}

// Initialize the database
export const db = new DigitalFormsDB();

// Open the database and clear formID for testing
const initDB = async () => {
  try {
    if (!db.isOpen()) {
      await db.open();
      console.log("IndexedDB is open.");
    } else {
      console.log("IndexedDB is already open.");
    }
    await db.formID.clear();
    console.log("Form IDs cleared.");
  } catch (error) {
    console.error("Open failed: " + error);
  }
};

initDB();
