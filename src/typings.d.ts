import 'express';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
    }

    interface Request {
      user?: User;
      cookies: {
        Authentication?: string;
        Refresh?: string;
        [key: string]: string | undefined;
      };
    }
  }
}
