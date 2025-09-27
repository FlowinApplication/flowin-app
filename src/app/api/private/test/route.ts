import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    const { userId, sessionClaims, sessionId, orgId, orgRole, orgSlug } = await auth();

    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    return NextResponse.json({
        message: "Private Endpoint TEST - User Authenticated",
        userData: {
            userId,
            sessionId,
            orgId,
            orgRole,
            orgSlug,
            sessionClaims
        }
    });
}