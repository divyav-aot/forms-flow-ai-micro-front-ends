import { db } from "./db";
import { fetchStaticData } from "../request/staticDataApi";
import { constructApplicationData, constructSubmissionData, handleError } from "../helpers/helperServices";
import { StaticResources } from "../constants/constants";
import testFormData from "./testFormData.json";

class DBInsertService {
  
  /**
   * Saves RSBC static data to IndexedDB.
   * @param {string} resourceName - The name of the resource.
   * @param {any} data - The data to be saved.
   */
  private static async saveRSBCDataToIndexedDB(resourceName: string, data: any) {
    try {
      // Check if IndexedDB is available
      if (!db) {
        throw new Error("IndexedDB is not available.");
      }

      // Check if data is valid
      if (!data || data.length === 0) {
        throw new Error(`No valid data provided for ${resourceName}.`);
      }

      switch (resourceName) {
        case "agencies":
          await db.agencies.clear();
          await db.agencies.bulkPut(data);
          console.log("Agencies data saved to IndexedDB.");
          break;
        case "cities":
          await db.cities.clear();
          await db.cities.bulkPut(data);
          console.log("Cities data saved to IndexedDB.");
          break;
        case "countries":
          await db.countries.clear();
          await db.countries.bulkPut(data);
          console.log("Countries data saved to IndexedDB.");
          break;
        case "jurisdictions":
          await db.jurisdictions.clear();
          await db.jurisdictions.bulkPut(data);
          console.log("Jurisdictions data saved to IndexedDB.");
          break;
        case "impound_lot_operators":
          await db.impoundLotOperators.clear();
          await db.impoundLotOperators.bulkPut(data);
          console.log("Impound Lot Operators data saved to IndexedDB.");
          break;
        case "provinces":
          await db.provinces.clear();
          await db.provinces.bulkPut(data);
          console.log("Provinces data saved to IndexedDB.");
          break;
        case "vehicle_styles":
          await db.vehicleStyles.clear();
          await db.vehicleStyles.bulkPut(data);
          console.log("Vehicle Styles data saved to IndexedDB.");
          break;
        case "vehicle_types":
          await db.vehicleTypes.clear();
          await db.vehicleTypes.bulkPut(data);
          console.log("Vehicle Types data saved to IndexedDB.");
          break;
        case "vehicle_colours":
          await db.vehicleColours.clear();
          await db.vehicleColours.bulkPut(data);
          console.log("Vehicle Colours data saved to IndexedDB.");
          break;
        case "vehicles":
          await db.vehicles.clear();
          await db.vehicles.bulkPut(data);
          console.log("Vehicles data saved to IndexedDB.");
          break;
        case "nsc_puj":
          await db.nscPuj.clear();
          await db.nscPuj.bulkPut(data);
          console.log("NSC PUJ data saved to IndexedDB.");
          break;
        case "jurisdiction_country":
          await db.jurisdictionCountry.clear();
          await db.jurisdictionCountry.bulkPut(data);
          console.log("Jurisdiction Country data saved to IndexedDB.");
          break;
        default:
          console.log(`No matching table found for resource: ${resourceName}`);
      }
    } catch (error) {
      console.error(`Error saving ${resourceName} to IndexedDB:`, error);
    }
  }

  /**
   * Fetches static data from API and saves it to IndexedDB.
   */
  public static async fetchAndSaveStaticData(): Promise<void> {
    try {
      await db.open();
      console.log("Fetching and saving static data...");

      // Create an array of promises for fetching data
      const fetchPromises = StaticResources.map(async (resource) => {
        try {              
            await fetchStaticData(
              resource,
              (data: any) => this.saveRSBCDataToIndexedDB(resource, data),
              (error: any) => handleError(error)
            );          
        } catch (error) {
          console.error(`Error processing resource ${resource}:`, error);
        }
      });

      // Wait for all API calls to complete in parallel
      await Promise.all(fetchPromises);

      console.log("All static data processed.");
    } catch (error) {
      console.error("Error in data fetching and saving process:", error);
    }
  }

  /**
   * Saves FormFlow data to IndexedDB.
   * @param {string} resourceName - The name of the resource.
   * @param {any} data - The data to be saved.
   */
  private static async saveFFDataToIndexedDB(resourceName: string, data: any) {
    try {
      // Check if IndexedDB is available
      if (!db) {
        throw new Error("IndexedDB is not available.");
      }

      // Check if data is valid
      if (!data || data.length === 0) {
        throw new Error(`No valid data provided for ${resourceName}.`);
      }

      switch (resourceName) {
        case "formList":
          await db.formList.clear();
          await db.formList.bulkPut(data.forms);
          await db.formListMetaData.clear();
          await db.formListMetaData.put({
            key: "metadata",
            totalCount: data.totalCount,
            pageNo: data.pageNo,
            limit: data.limit
          })
          console.log("Form List data saved to IndexedDB.");
          break;
        case "application":
          // await db.application.clear();
          await db.application.put(data);
          break;
        case "draft":
          await db.draft.clear();
          await db.draft.bulkPut(data.drafts);
          await db.draftMetaData.put({
            key: "metadata",
            applicationCount: data.applicationCount,
            totalCount: data.totalCount,
          })
          console.log("Drafts data saved to IndexedDB.");
          break;
        case "submission":
          // await db.submission.clear();
          await db.offlineSubmission.put(data);
          console.log("Offline submission data saved to IndexedDB.");
          break;
        default:
          console.log(`No matching table found for resource: ${resourceName}`);
      }
    } catch (error) {
      console.error(`Error saving ${resourceName} to IndexedDB:`, error);
    }
  }  
  
  /**
   * Inserts FormFlow data into IndexedDB.
   * @param {string} resourceName - The name of the resource.
   * @param {any} data - The data to be inserted.
   */
  public static async insertFFData (resourceName: string, data: any): Promise<void> {
    try {
      await this.saveFFDataToIndexedDB(resourceName, data);         
    } catch (error) {
      console.error(`Error processing resource ${resourceName}:`, error);
    }
  }

  /**
   * Inserts submission data into IndexedDB.
   * @param {any} data - Submission data to be stored.
   * @param {string} formId - Form ID associated with the submission.
   */
  public static async insertSubmissionData (data: any, formId: string): Promise<void> {
    try {
      // const formData = this.fetchOfflineFormById(formId);
      // const formData = testFormData;
      const formData = {};
      const submissionData = constructSubmissionData(data, formId);
      const applicationData = constructApplicationData(formId, submissionData._id, formData)
      await this.saveFFDataToIndexedDB("submission", submissionData);
      await this.saveFFDataToIndexedDB("application", applicationData)         
    } catch (error) {
      console.error(`Error processing offline submission or application data:`, error);
    }
  }
  
}
export default DBInsertService;
