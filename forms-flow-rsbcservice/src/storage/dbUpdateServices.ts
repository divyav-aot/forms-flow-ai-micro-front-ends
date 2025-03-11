import { ffDb, OfflineSubmission } from "./ffDb";
import DBServiceHelper from "../helpers/helperDbServices";
import OfflineFetchService from "./dbFetchServices";
import OfflineSaveService from "./dbInsertServices";

class OfflineEditService {
  public static async updateOfflineDraftData(
    draftId: string,
    newData: Record<string, any>
  ): Promise<{ status: string; message?: string }> {
    try {
      const draft = await OfflineFetchService.fetchOfflineSubmissionByInputId(
        draftId,
        "localDraftId"
      );

      // Merging new data with existing data
      draft.data = { ...draft.data, ...newData.data };

      // Update modified timestamp
      draft.modified = new Date().toISOString();

      // Save the updated draft back to IndexedDB
      await OfflineSaveService.saveFFDataToIndexedDB(
        "offlineSubmission",
        draft
      );
      //   await offlineSubmissions.put(draft);

      console.log(`Draft with localDraftId ${draftId} updated successfully.`);

      return { status: "success" };
    } catch (error) {
      console.error(
        `Error updating draft data for localDraftId ${draftId}:`,
        error
      );
      return { status: "error", message: error.message };
    }
  }

  public static async updateOfflineSubmissionData(
    draftId: string,
    formId: string,
    serverDraftId: string,
    newSubmissionData?: {
      access: any[];
      owner: string;
      externalIds: any[];
      roles: any[];
      metadata: Record<string, any>;
      form: string;
      created: string;
      modified: string;
      data: Record<string, any>;
      _id: string;
    }
  ): Promise<{ status: string; message?: string }> {
    try {
      let draft = await OfflineFetchService.fetchOfflineSubmissionByInputId(
        draftId,
        "localDraftId"
      );
      // Update the required fields from newSubmissionData
      draft = DBServiceHelper.constructUpdateOfflineSubmissionData(
        draft,
        newSubmissionData,
        serverDraftId
      );

      // Save the updated draft back to IndexedDB
      //   await offlineSubmissions.put(draft);
      await OfflineSaveService.saveFFDataToIndexedDB(
        "offlineSubmission",
        draft
      );
      const formData = await OfflineFetchService.fetchOfflineFormById(formId);
      const applicationData = DBServiceHelper.constructApplicationData(
        formId,
        draft.localSubmissionId,
        formData
      );
      await OfflineSaveService.saveFFDataToIndexedDB(
        "applications",
        applicationData
      );
      await ffDb.activeForm.clear();
      return {
        status: "success",
        message: `Submission with localDraftId ${draftId} updated successfully.`,
      };
    } catch (error) {
      console.error(
        `Error updating submission data for localDraftId ${draftId}:`,
        error
      );
      return { status: "error", message: error.message };
    }
  }

  public static async updateActiveFormTable(
    updateColumn: string,
    updateValue: string,
    whereColumn: string,
    whereValue: string
  ): Promise<{ status: string; message?: string }> {
    try {
      const localUpdateValue = Number(updateValue);
      const localWhereValue = Number(whereValue);

      if (isNaN(localUpdateValue) || isNaN(localWhereValue)) {
        console.error("Invalid updateValue/whereValue: Not a valid number");
        return null;
      }
      if (!ffDb) {
        throw new Error("IndexedDB is not available.");
      }
      await ffDb.open();

      // Get reference to the specified table
      const table = ffDb["activeForm"];

      if (!table) {
        throw new Error(`Table activeForm not found in IndexedDB.`);
      }

      // Find the record matching the whereColumn condition
      const record = await table
        .where(whereColumn)
        .equals(localWhereValue)
        .first();

      if (!record) {
        return {
          status: "failure",
          message: `No record found with ${whereColumn}: ${whereValue}`,
        };
      }

      // Update the column value
      record[updateColumn] = localUpdateValue;

      // Save the updated record back to IndexedDB
      await table.put(record);

      return {
        status: "success",
        message: `Updated ${updateColumn} in activeForm successfully.`,
      };
    } catch (error) {
      console.error(`Error updating ${updateColumn} in activeForm:`, error);
      return { status: "failure", message: error.message };
    }
  }
}
export default OfflineEditService;
