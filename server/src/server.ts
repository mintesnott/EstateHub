import app from "./app.js";
import { startBreachJob } from "./jobs/breach.job.js";

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

  startBreachJob();
});