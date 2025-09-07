import fs from 'fs';
import path from 'path';


const logDir = path.resolve(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
const logFile = path.join(logDir, 'app.log');

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  path?: string;
  type?: "query" | "mutation" | "subscription";
  session?: any;
  requestId?: string;
  error?: any;
  args?: any;
}

export function log(
  message: string,
  context: LogContext = {},
  level: LogLevel = 'info'
) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...context,
  };
  fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
}
