const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

//const ONE_MINUTES_MS = 1 * 60 * 1000; // 180,000 ms


export function calculateResponseDeadline(from: Date = new Date()): Date {

 // return new Date(from.getTime() + THREE_DAYS_MS);

 return new Date(from.getTime() + THREE_DAYS_MS);
}