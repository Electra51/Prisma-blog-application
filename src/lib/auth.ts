import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import "dotenv/config";
import nodemailer from "nodemailer";
import { prisma } from "./prisma";

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

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
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      console.log({ user, url, token });

      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"Prisma Blog" <prismablog@gmail.com>', // sender address
          to: user.email, // list of recipients
          subject: "Verify your email | Prisma Blog", // subject line
          text: `
Hi ${user.name},

Welcome to Prisma Blog!

Please verify your email address by opening this link:
${verificationUrl}

If you didn't create an account, you can ignore this email.
      `, // plain text body
          html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Email</title>
</head>

<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#18181b;">

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
    style="background-color:#f4f4f5;padding:40px 12px;">
    <tr>
      <td align="center">

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
          style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td align="center"
              style="background-color:#18181b;padding:28px 24px;">
              <h1 style="margin:0;font-size:25px;line-height:1.4;color:#ffffff;">
                Prisma <span style="color:#a78bfa;">Blog</span>
              </h1>
              <p style="margin:8px 0 0;font-size:13px;color:#d4d4d8;">
                Your ideas deserve a place.
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:36px 28px 24px;">

              <h2 style="margin:0 0 16px;font-size:24px;line-height:1.4;color:#18181b;">
                Verify your email address
              </h2>

              <p style="margin:0 0 16px;font-size:15px;line-height:1.8;color:#52525b;">
                Hi ${user.name},
              </p>

              <p style="margin:0 0 24px;font-size:15px;line-height:1.8;color:#52525b;">
                Welcome to Prisma Blog! We're excited to have you here.
                Please verify your email address to complete your account setup.
              </p>

              <!-- Verification Button -->
              <table role="presentation" cellspacing="0" cellpadding="0"
                style="margin:0 auto 28px;">
                <tr>
                  <td align="center" bgcolor="#7c3aed"
                    style="border-radius:8px;">
                    <a href="${verificationUrl}"
                      target="_blank"
                      style="display:inline-block;padding:15px 30px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:bold;border-radius:8px;">
                      Verify My Email
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px;font-size:13px;line-height:1.7;color:#71717a;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>

              <p style="margin:0 0 24px;font-size:13px;line-height:1.7;word-break:break-all;">
                <a href="${verificationUrl}"
                  target="_blank"
                  style="color:#7c3aed;text-decoration:underline;">
                  ${verificationUrl}
                </a>
              </p>

              <div style="height:1px;background-color:#e4e4e7;margin:24px 0;"></div>

              <p style="margin:0;font-size:13px;line-height:1.8;color:#71717a;">
                If you didn't create a Prisma Blog account, you can safely ignore this email.
                Please don't share this verification link with anyone.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center"
              style="background-color:#fafafa;padding:22px 24px;border-top:1px solid #e4e4e7;">

              <p style="margin:0 0 6px;font-size:12px;color:#71717a;">
                © ${new Date().getFullYear()} Prisma Blog
              </p>

              <p style="margin:0;font-size:12px;color:#a1a1aa;">
                This is an automated email. Please do not reply.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
      `, // HTML body
        });

        console.log("Message sent: %s", info.messageId);
      } catch (err) {
        console.error("error", err);
      }
    },
  },
});
