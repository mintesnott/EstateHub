import app from "./app.js";
import { startBreachJob } from "./jobs/breach.job.js";

const PORT = Number(process.env.PORT) || 8000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);

  startBreachJob();
});