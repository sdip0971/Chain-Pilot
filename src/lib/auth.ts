import {checkout,polar,portal} from "@polar-sh/better-auth"
import { betterAuth, check } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import { polarClient } from "./polar";
// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from "@/generated/prisma/client";
import { TruckElectric } from "lucide-react";
function getTrustedOrigins(): string[] {
  // Example ENV format: TRUSTED_ORIGINS="http://localhost:3000,http://192.168.100.107:3000"
  const raw = process.env.TRUSTED_ORIGINS || "";
  // fallback to localhost for dev
  if (!raw) return ["http://localhost:3000"];
  return raw.split(",").map(s => s.trim()).filter(Boolean);
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  trustedOrigins: getTrustedOrigins(),
  // plugins: [
  //   polar({
  //     client: polarClient() as any,
  //     createCustomerOnSignUp:false,
  //     use: [
  //       checkout({
  //         products: [
  //           {
  //             productId: "7fd67e7c-daf2-4493-ae06-c455087e35f6",
  //             slug: "Pro",
  //           },
  //         ],
  //         successUrl:process.env.POLAR_SUCCESS_URL,
  //         authenticatedUsersOnly:true,
  //       }),
  //       portal(),
        
  //     ],
  //   }),
  // ],
});