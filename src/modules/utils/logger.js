/**
 * Logger Module
 * Provides consistent logging functionality across the extension
 */

export class Logger {
  constructor(module) {
    this.module = module;
    this.isDebug = process.env.NODE_ENV === 'development';
  }

  info(message, ...args) {
    console.log(`[${this.module}] ${message}`, ...args);
  }

  error(message, error) {
    console.error(`[${this.module}] Error: ${message}`, error);
  }

  debug(message, ...args) {
    if (this.isDebug) {
      console.debug(`[${this.module}] Debug: ${message}`, ...args);
    }
  }

  warn(message, ...args) {
    console.warn(`[${this.module}] Warning: ${message}`, ...args);
  }
}
