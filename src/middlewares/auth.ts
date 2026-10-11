import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

//global type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log(roles);
    try {
      //get user session
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });

      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized!",
        });
      }

      if (!session.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Email verification required ! please verity your email",
        });
      }

      //user er data k req er moddhe rahte
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role as string,
        emailVerified: session.user.emailVerified,
      };

      if (roles.length && !roles.includes(req.user.role as UserRole)) {
        return res.status(403).json({
          success: false,
          message:
            "Forbidden! You don't have permission to access this resources",
        });
      }

      next();
    } catch (err) {
      console.error("error", err);
    }
  };
};

export default auth;
