import { NextResponse } from "next/server";
import { checkClaimEmailDomain } from "@/lib/claims/domainCheck";
import { createOtp, otpKey, OTP_TTL_MS } from "@/lib/claims/otpStore";

/**
 * Issues a verification code for a university profile claim.
 *
 * No email provider is integrated yet, so the code is returned in the
 * response and displayed in the UI. That means anyone who can call this
 * endpoint can read the code, so it is gated behind CLAIM_OTP_DEV_MODE.
 * Set CLAIM_OTP_DEV_MODE="false" once mail delivery exists — the code is
 * then withheld from the response and only `delivered` comes back.
 */
const DEV_MODE = process.env.CLAIM_OTP_DEV_MODE !== "false";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { universityId, universityName, officialEmail } = body;

    if (!officialEmail || !universityName) {
      return NextResponse.json(
        { error: "Official email and university name are required." },
        { status: 400 },
      );
    }

    if (!String(officialEmail).includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid institutional email address." },
        { status: 400 },
      );
    }

    // Reject a mismatched domain before issuing a code, so the applicant
    // finds out now rather than after typing in an OTP.
    const domainError = await checkClaimEmailDomain(
      universityId,
      universityName,
      officialEmail,
    );
    if (domainError) {
      return NextResponse.json({ error: domainError }, { status: 400 });
    }

    const { code } = createOtp(otpKey(officialEmail, universityId));

    if (!DEV_MODE) {
      // TODO: send `code` to officialEmail once a mail provider exists.
      console.info(`[claims] OTP issued for ${officialEmail} (not exposed)`);
      return NextResponse.json({
        success: true,
        delivered: "email",
        expiresInSeconds: OTP_TTL_MS / 1000,
      });
    }

    return NextResponse.json({
      success: true,
      delivered: "devDisplay",
      devOtp: code,
      expiresInSeconds: OTP_TTL_MS / 1000,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to send verification code." },
      { status: 500 },
    );
  }
}
