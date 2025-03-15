import { NextResponse } from "next/server";
import Claim from "@/lib/models/claimModel";
import { ConnectDB } from "@/lib/config/db";
import cloudinary from "@/lib/utils/cloudinary";

export async function GET(req) {
    await ConnectDB();

    try {
        const url = new URL(req.url);
        const status = url.searchParams.get("status");
        const minAmount = parseFloat(url.searchParams.get("minAmount"));
        const maxAmount = parseFloat(url.searchParams.get("maxAmount"));

        let filters = {};
        if (status) filters.status = status;
        if (!isNaN(minAmount) || !isNaN(maxAmount))
            filters.amount = { ...(minAmount && { $gte: minAmount }), ...(maxAmount && { $lte: maxAmount }) };

        const claims = await Claim.find(filters).sort({ submissionDate: -1 });

        return NextResponse.json(
            claims.map((claim) => ({
                id: claim._id.toString(), // ✅ Convert `_id` to `id`
                name: claim.name,
                email: claim.email,
                amount: claim.amount,
                description: claim.description,
                documentUrl: claim.documentUrl,
                status: claim.status,
                date: claim.submissionDate,
            })),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching claims:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
