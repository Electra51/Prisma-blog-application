import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";

async function seedAdmin() {
  try {
    //check user exits on db or not
    const adminData = {
      name: "Admin1",
      email: "admin1@admin.com",
      role: UserRole.ADMIN,
      password: "admin1234",
      emailVerified: true,
    };

    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existingUser) {
      throw new Error("User already exists in db");
    }

    const signUpAdmin = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:4000",
        },
        body: JSON.stringify({
          name: adminData.name,
          email: adminData.email,
          password: adminData.password,
        }),
      },
    );

    const responseData = await signUpAdmin.json();

    console.log("Status:", signUpAdmin.status);
    console.log("Response:", responseData);
    //email verified update
    if (signUpAdmin.ok) {
      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });
    }

    if (!signUpAdmin.ok) {
      throw new Error(
        `Admin signup failed: ${signUpAdmin.status} - ${JSON.stringify(responseData)}`,
      );
    }

    console.log(signUpAdmin);
  } catch (err) {
    console.log("error", err);
  }
}

seedAdmin();
