import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 500;
async function main() {
  try {
    await prisma.$connect(); //prisma connect korlm
    console.log("Connected to database successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("An error occurrd:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
