import 'express';

declare module 'express' {
  export interface Request {
    user?: {
      userId: string;
      email: string;
    };
    cookies: {
      Authentication?: string;
      Refresh?: string;
      [key: string]: string | undefined;
    };
  }
}
