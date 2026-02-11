import 'express';

declare module 'express' {
  export interface Request {
    cookies: {
      Authentication?: string;
      Refresh?: string;
      [key: string]: string | undefined;
    };
  }
}
