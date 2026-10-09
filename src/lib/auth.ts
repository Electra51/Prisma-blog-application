import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import "dotenv/config";
import { prisma } from "./prisma";

const appUrl = process.env.APP_URL ?? "http://localhost:5000";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [appUrl],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
});
