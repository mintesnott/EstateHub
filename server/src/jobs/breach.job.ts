import { processBreachedInquiries } from "../modules/inquiries/inquiry.service.js";

const BREACH_CHECK_INTERVAL_MS = 5 * 60 * 1000; // every 5 minutes


export function startBreachJob(): void {
 
  console.log(
    `[breach-job] Started – checking every ${BREACH_CHECK_INTERVAL_MS / 1000}s`
  );

  // Run once immediately on startup (optional but useful)
  void runBreachCheck();

  setInterval(() => {
    void runBreachCheck();
  }, BREACH_CHECK_INTERVAL_MS);
} 


 async function runBreachCheck(): Promise<void> {
  try {
    const count = await processBreachedInquiries();
    if (count > 0) {
      console.log(`[breach-job] Marked ${count} inquiries as BREACHED`);
    }
  } catch (err) {
    console.error("[breach-job] Failed to process breached inquiries:", err);
  }
}