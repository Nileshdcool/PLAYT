import fs from 'fs';
import path from 'path';

// Logs directory relative to project root
const logDir = path.resolve(process.cwd(), 'logs');
// Ensure logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
const logFile = path.join(logDir, 'app.log');

export function log(message: string, p0: { path: string; type: "query" | "mutation" | "subscription"; session: any; }) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
}
