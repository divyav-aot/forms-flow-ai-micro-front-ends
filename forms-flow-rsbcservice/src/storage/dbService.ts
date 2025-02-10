import { db } from "./db";
import { fetchStaticData } from "../request/staticDataApi";
import { handleError } from "../helpers/helperServices";
import { StaticResources, StaticTables, TableMetadataMapping } from "../constants/constants";

class DBService {
    
  private static async saveToIndexedDB(resourceName: string, data: any) {
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
          await db.application.clear();
          await db.application.bulkPut(data.applications);
          await db.applicationMetaData.put({
            key: "metadata",
            draftCount: data.draftCount,
            totalCount: data.totalCount,
            pageNo: data.pageNo,
            limit: data.limit
          })
          console.log("Applications data saved to IndexedDB.");
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
        default:
          console.log(`No matching table found for resource: ${resourceName}`);
      }
    } catch (error) {
      console.error(`Error saving ${resourceName} to IndexedDB:`, error);
    }
  }

  public static async fetchAndSaveStaticData(): Promise<void> {
    try {
      await db.open();
      console.log("Fetching and saving static data...");

      // Create an array of promises for fetching data
      const fetchPromises = StaticResources.map(async (resource) => {
        try {              
            await fetchStaticData(
              resource,
              (data: any) => this.saveToIndexedDB(resource, data),
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
  
  public static async fetchStaticDataFromTable(tableName: string): Promise<any[]> {
    try {
      if (!db) throw new Error("IndexedDB is not available.");
      if (!StaticTables.includes(tableName)) throw new Error(`Table ${tableName} is not accessible.`);
  
      await db.open(); // Ensure the database is open
  
      const table = db[tableName];
      if (!table) throw new Error(`Table ${tableName} not found in IndexedDB.`);
  
      const data = await table.toArray();
      if (!data.length) console.warn(`No data found in table ${tableName}.`);
  
      return data;
    } catch (error) {
      console.error(`Error fetching data from table ${tableName}:`, error);
      throw error;
    }
  }
  
  public static async insertFFData (resourceName: string, data: any): Promise<void> {
    try {
      await this.saveToIndexedDB(resourceName, data);         
    } catch (error) {
      console.error(`Error processing resource ${resourceName}:`, error);
    }
  }
  
  public static async fetchDataFromTable(tableName: string): Promise<any> {
    try {
      if (!db) {
        throw new Error("IndexedDB is not available.");
      }
      await db.open();
  
      // Retrieve mapping from the enum
      const tableMapping = TableMetadataMapping[tableName] || {};
      const { metadataTable = "", dataKey = tableName } = tableMapping;
  
      const table = db[tableName];
      const metadataTableRef = metadataTable ? db[metadataTable] : null;
  
      if (!table) {
        throw new Error(`Table ${tableName} not found in IndexedDB.`);
      }
  
      // Fetch data and metadata
      const data = await table.toArray();
      const metadata = metadataTableRef ? await metadataTableRef.toArray() : [];
  
      // Construct finalData dynamically
      const finalData: Record<string, any> = {
        [dataKey]: data,
        metadata
      };
  
      if (data.length === 0) {
        console.log(`No data found in table ${tableName}.`);
      }
  
      return finalData;
    } catch (error) {
      console.error(`Error fetching data from table ${tableName}:`, error);
      throw error;
    }
  } 
}
export default DBService;
