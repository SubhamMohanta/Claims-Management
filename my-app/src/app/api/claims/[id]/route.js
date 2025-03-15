import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/db";
import Claim from "@/lib/models/claimModel";

export async function PATCH(req, { params }) {
    await ConnectDB();

    const { id } = params;
    try {
        const { status, approvedAmount, insurerComments } = await req.json();
        
        if (!["Approved", "Rejected"].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const updatedClaim = await Claim.findByIdAndUpdate(
            id,
            { 
                status, 
                approvedAmount: parseFloat(approvedAmount), // ✅ Ensure float conversion
                insurerComments 
            },
            { new: true }
        );

        if (!updatedClaim) {
            return NextResponse.json({ error: "Claim not found" }, { status: 404 });
        }

        return NextResponse.json(updatedClaim, { status: 200 });
    } catch (error) {
        console.error("Error updating claim:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
