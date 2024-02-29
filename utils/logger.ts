/* eslint-disable no-console */

export default {
  log(...data: any[]): void {
    console.log(...data);
  },

  error(e: any, ...data: any[]): void {
    if (process.env.NODE_ENV !== "test") {
      console.error(e, ...data);
    }
  },

  warn(message: string, ...data: any[]): void {
    if (process.env.NODE_ENV !== "test") {
      console.warn(message, ...data);
    }
  },
};
