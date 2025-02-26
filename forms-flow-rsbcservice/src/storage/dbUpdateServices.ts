import { ffDb, OfflineSubmission } from "./ffDb";
import DBServiceHelper from "../helpers/helperDbServices";

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
        draft.data = { ...draft.data, ...newData }; 

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

}
export default OfflineEditService;
