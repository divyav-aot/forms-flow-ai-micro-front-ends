import { ffDb, OfflineSubmission } from "./ffDb";
import DBServiceHelper from "../helpers/helperDbServices";
import OfflineFetchService from "./dbFetchServices";
import OfflineSaveService from "./dbInsertServices";

class OfflineEditService {
  
  public static async updateOfflineDraftData(localDraftId: string, newData: Record<string, any>): Promise<{ status: string; error?: string }> {
    try {
        if (!ffDb) {
            throw new Error("IndexedDB is not available.");
        }
        await ffDb.open();

        // Get reference to the offlineSubmissions table
        const offlineSubmissions = ffDb["offlineSubmissions"];

        if (!offlineSubmissions) {
            throw new Error("Table offlineSubmissions not found in IndexedDB.");
        }

        // Find the draft by localDraftId
        const draft: OfflineSubmission | undefined = await offlineSubmissions
            .where("localDraftId")
            .equals(localDraftId)
            .first();

        if (!draft) {
          return { status: "error", error: `No draft found with localDraftId: ${localDraftId}` };
        }

        // Merging new data with existing data
        draft.data = { ...draft.data, ...newData.data }; 

        // Update modified timestamp
        draft.modified = new Date().toISOString();

        // Save the updated draft back to IndexedDB
        await offlineSubmissions.put(draft);

        console.log(`Draft with localDraftId ${localDraftId} updated successfully.`);

        return { status: "success" };
    } catch (error) {
        console.error(`Error updating draft data for localDraftId ${localDraftId}:`, error);
        return { status: "error", error: error.message };
    }
  }

  public static async updateOfflineSubmissionData(
    newSubmissionData: {
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
    },
    localDraftId: string,
    formId: string
): Promise<{ status: string; error?: string }> {
    try {
        if (!ffDb) {
            throw new Error("IndexedDB is not available.");
        }
        await ffDb.open();

        // Get reference to the offlineSubmissions table
        const offlineSubmissions = ffDb["offlineSubmissions"];

        if (!offlineSubmissions) {
            throw new Error("Table offlineSubmissions not found in IndexedDB.");
        }

        // Find the draft by localDraftId
        let draft: OfflineSubmission | undefined = await offlineSubmissions
            .where("localDraftId")
            .equals(localDraftId)
            .first();

        if (!draft) {
            return { status: "failure", error: `No draft found with localDraftId: ${localDraftId}` };
        }

        // Update the required fields from newSubmissionData
        draft = DBServiceHelper.constructUpdateOfflineSubmissionData(draft, newSubmissionData);

        // Save the updated draft back to IndexedDB
        await offlineSubmissions.put(draft);
        const formData = await OfflineFetchService.fetchOfflineFormById(formId);
        const applicationData = DBServiceHelper.constructApplicationData(formId, draft.localSubmissionId, formData);
        await OfflineSaveService.saveFFDataToIndexedDB("applications", applicationData);
        await ffDb.activeForm.clear();
        console.log(`Submission with localDraftId ${localDraftId} updated successfully.`);
        return { status: "success" };
    } catch (error) {
        console.error(`Error updating submission data for localDraftId ${localDraftId}:`, error);
        return { status: "failure", error: error.message };
    }
  }


}
export default OfflineEditService;
