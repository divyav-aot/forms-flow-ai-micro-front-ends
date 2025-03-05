import { RequestService } from "@formsflow/service";
import { WEB_BASE_URL } from "../endpoints/config";
import {
  OfflineDeleteService,
  OfflineFetchService
} from "../formsflow-rsbcservices";
import { OfflineSubmission } from "../storage/ffDb";

class OfflineSubmissions {
  /**
   * Process offline submissions by fetching, processing drafts and submissions,
   * and deleting local submissions after the processes complete.
   */
  public static async processOfflineSubmissions(): Promise<void> {
    try {
      // Fetch all non-active offline submissions
      const submissions =
        await OfflineFetchService.fetchAllNonActiveOfflineSubmissions();
      console.log(submissions, "++++++++++++++submissions");

      // Process drafts and submissions concurrently using Promise.all
      const processDraftsPromise = this.processDrafts(submissions);
      const processSubmissionPromise = this.processSubmission(submissions);

      // Wait for both processes to finish
      await Promise.all([processDraftsPromise, processSubmissionPromise]);

      // Deleting local submissions only after both processes are complete.
      await this.deleteLocalSubmissions(submissions);
    } catch (error) {
      console.error("Error processing drafts or submissions:", error);
    }
  }

  /**
   * Process the drafts from submissions.
   * @param submissions list of submissions that need to be processed.
   */
  private static async processDrafts(
    submissions: OfflineSubmission[]
  ): Promise<void> {
    const draftSubmissions = submissions.filter(
      (submission) => submission.type === "draft"
    );
    draftSubmissions.forEach(async (draft) => {
      if (
        draft.localDraftId &&
        draft.draftData.serverDraftId &&
        draft.draftData.serverApplicationId
      ) {
        // When localDraftId is present if both serverDraftId, serverApplicationId
        // then draft submission need to updated.
        console.log(draft);
        await this.prepareAndUpdateDraft(draft);
      }
      if (
        draft.localDraftId &&
        !draft.draftData.serverDraftId &&
        !draft.draftData.serverApplicationId
      ) {
        // When localDraftId is present without serverDraftId, serverApplicationId
        //then a new draft submission is created.
        console.log(draft);
        await this.prepareAndSubmitDraft(draft);
      }
    });
  }

  /**
   * Prepare and submit a new draft.
   * @param draft draft submissions that need to be submitted in DB.
   */
  private static async prepareAndSubmitDraft(
    draft: OfflineSubmission
  ): Promise<void> {
    console.log(draft);
    const url = `${WEB_BASE_URL}/draft`;
    const payload = {
      data: draft.data,
      formId: draft.formId
    };
    await RequestService.httpPOSTRequest(url, payload);
  }

  /**
   * Prepare and update an existing draft.
   * @param draft draft submissions that need to be updated in DB.
   */
  private static async prepareAndUpdateDraft(
    draft: OfflineSubmission
  ): Promise<void> {
    console.log(draft);
    const url = `${WEB_BASE_URL}/draft/${draft.draftData.serverDraftId}`;
    const payload = {
      data: draft.data,
      formId: draft.formId
    };
    RequestService.httpPUTRequest(url, payload);
  }

  /**
   * Process the submissions.
   * @param submissions list of offline submissions that need to be processed.
   */
  private static async processSubmission(
    submissions: OfflineSubmission[]
  ): Promise<void> {
    // TODO: EDIT type
    const submittedData = submissions.filter(
      (submission) => submission.type === "submit"
    );
    submittedData.forEach(async (data) => {
      if (
        data.localDraftId &&
        data.draftData.serverDraftId &&
        data.draftData.serverApplicationId
      ) {
        // When localDraftId is present if both serverDraftId, serverApplicationId
        // then the data need to updated.
        console.log(data);
        await this.prepareAndUpdateSubmission(data);
      }
      if (
        data.localDraftId &&
        !data.draftData.serverDraftId &&
        !data.draftData.serverApplicationId
      ) {
        // When localDraftId is present without serverDraftId, serverApplicationId
        //then a the data need to be created as a new submission.
        console.log(data);
        await this.prepareAndSubmitSubmission(data);
      }
    });
  }

  /**
   * Prepare and submit a new submission.
   * @param data submission need to be submitted in DB
   */
  private static async prepareAndSubmitSubmission(
    data: OfflineSubmission
  ): Promise<void> {
    console.log(data);
    // todo: first call to formio,
    // todo: 2nd call to server
  }

  /**
   * Prepare and update an existing submission.
   * @param data submission need to be updated in DB
   */
  private static async prepareAndUpdateSubmission(
    data: OfflineSubmission
  ): Promise<void> {
    console.log(data);
    // todo: first call to formio,
    // todo: 2nd call to server
    // todo: delete the draft entry form the server db??
  }

  /**
   * Delete local submissions after processing.
   * @param submissions list of offline submissions that need to be processed.
   */
  private static async deleteLocalSubmissions(
    submissions: OfflineSubmission[]
  ): Promise<void> {
    const localSubmissionIdsToDelete = submissions.map(
      (submission) => submission._id
    );
    console.log(
      localSubmissionIdsToDelete,
      "+++++++++++++localSubmissionIdsToDelete"
    );
    await OfflineDeleteService.bulkOfflineSubmissionDelete(
      localSubmissionIdsToDelete
    );
  }
}
export default OfflineSubmissions;
