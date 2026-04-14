import { prisma } from "./prisma";
import { UserRole, VerificationStatus } from "@/app/generated/prisma/client";

/**
 * Checks if a user is verified based on their role.
 * Sellers (Individual, Retailer, Wholesaler, Network Provider) must have
 * their role-specific profile status set to VERIFIED.
 */
export async function isUserVerified(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      sellerProfile: true,
      retailerProfile: true,
      wholesalerProfile: true,
      networkProviderProfile: true,
    },
  });

  if (!user) return false;

  // Admin is always "verified" for operational purposes
  if (user.role === UserRole.ADMIN) return true;

  // Buyers don't need verification to "trade" (they are users)
  // but if the requirement implies they MUST be verified to buy, we'd add it here.
  // The current requirement focuses on high-level seller roles.
  if (user.role === UserRole.BUYER) return true;

  let vStatus: VerificationStatus = VerificationStatus.UNVERIFIED;

  if (user.role === UserRole.INDIVIDUAL_SELLER && user.sellerProfile) {
    vStatus = user.sellerProfile.verification;
  } else if (user.role === UserRole.RETAILER && user.retailerProfile) {
    vStatus = user.retailerProfile.verification;
  } else if (user.role === UserRole.WHOLESALER && user.wholesalerProfile) {
    vStatus = user.wholesalerProfile.verification;
  } else if (user.role === UserRole.NETWORK_PROVIDER && user.networkProviderProfile) {
    vStatus = user.networkProviderProfile.verification;
  }

  return vStatus === VerificationStatus.VERIFIED;
}

/**
 * Throws an error or returns a standard response if the user is not verified.
 * Used in API routes to "hard-gate" trading actions.
 */
export async function requireVerifiedSeller(userId: string) {
  const verified = await isUserVerified(userId);
  if (!verified) {
    return {
      error: "Verification Required",
      message: "You must complete your verification profile before participating in trading activities.",
      status: 403,
    };
  }
  return { success: true };
}
