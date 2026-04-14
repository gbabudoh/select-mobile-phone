import { Novu } from "@novu/node";

const novu = new Novu(process.env.NOVU_API_KEY!);

/**
 * Triggers a notification workflow in Novu.
 * 
 * @param workflowId The internal identifier for the Novu workflow.
 * @param userId The ID of the subscriber to receive the notification.
 * @param payload Key-value pairs matching the variables defined in the Novu template.
 */
export async function triggerNotification(workflowId: string, userId: string, payload: Record<string, unknown>) {
  try {
    const response = await novu.trigger(workflowId, {
      to: {
        subscriberId: userId,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      payload: payload as any,
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to trigger Novu notification (${workflowId}):`, error);
    // We don't throw here to prevent notification failures from breaking core business logic
    return null;
  }
}

/**
 * Ensures a subscriber exists in Novu.
 */
export async function upsertSubscriber(userId: string, data: { email: string; firstName?: string; lastName?: string; phone?: string }) {
  try {
    await novu.subscribers.identify(userId, data);
  } catch (error) {
    console.error("Failed to upsert Novu subscriber:", error);
  }
}

export default novu;
