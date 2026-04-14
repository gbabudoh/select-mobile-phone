import "dotenv/config";
import { PrismaClient } from "@generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DEMO_ACCOUNTS = [
  { email: "buyer@demo.com", password: "buyer1234", name: "Demo Buyer", role: "BUYER" as const },
  { email: "individual@demo.com", password: "individual1234", name: "Demo Individual Seller", role: "INDIVIDUAL_SELLER" as const },
  { email: "retail@demo.com", password: "retail1234", name: "Demo Retailer", role: "RETAILER" as const },
  { email: "wholesale@demo.com", password: "wholesale1234", name: "Demo Wholesaler", role: "WHOLESALER" as const },
  { email: "network@demo.com", password: "network1234", name: "Demo Network Provider", role: "NETWORK_PROVIDER" as const },
];

async function main() {
  for (const account of DEMO_ACCOUNTS) {
    const existing = await prisma.user.findUnique({ where: { email: account.email } });
    if (existing) {
      console.log(`Skip: ${account.email} already exists`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(account.password, 10);

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: account.email,
          password: hashedPassword,
          name: account.name,
          role: account.role,
          status: "ACTIVE",
          emailVerified: true,
        },
      });

      switch (account.role) {
        case "BUYER":
          await tx.buyerProfile.create({ data: { userId: user.id } });
          break;
        case "INDIVIDUAL_SELLER":
          await tx.individualSellerProfile.create({
            data: { userId: user.id, displayName: account.name, verification: "VERIFIED" },
          });
          break;
        case "RETAILER":
          await tx.retailerProfile.create({
            data: { userId: user.id, storeName: "Demo Retail Store", verification: "VERIFIED" },
          });
          break;
        case "WHOLESALER":
          await tx.wholesalerProfile.create({
            data: { userId: user.id, businessName: "Demo Wholesale Co.", verification: "VERIFIED" },
          });
          break;
        case "NETWORK_PROVIDER":
          await tx.networkProviderProfile.create({
            data: { userId: user.id, carrierName: "Demo Mobile", carrierType: "MVNO", verification: "VERIFIED" },
          });
          break;
      }

      console.log(`Created ${account.role}: ${account.email}`);
    });
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
