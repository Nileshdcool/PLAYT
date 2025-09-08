import fs from 'fs';
import path from 'path';



let logFile: string | null = null;
try {
  const logDir = path.resolve(process.cwd(), 'logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  logFile = path.join(logDir, 'app.log');
} catch (err) {
  // Fallback: cannot write to disk (e.g., Vercel)
  logFile = null;
}

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
  if (logFile) {
    try {
      fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
    } catch (err) {
      // Fallback to console logging if file write fails
      console.log('[LOG]', JSON.stringify(logEntry));
    }
  } else {
    // Always fallback to console logging if logFile is null
    console.log('[LOG]', JSON.stringify(logEntry));
  }
}
