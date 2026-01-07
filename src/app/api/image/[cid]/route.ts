import { NextResponse, type NextRequest } from "next/server";
import { auth } from '@clerk/nextjs/server';
import User from "@/models/User";
import dbConnect from "@/lib/db";
import { decryptBuffer } from "@/lib/encryption";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ cid: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { cid } = await params;

        await dbConnect();
        const user = await User.findOne({ clerkId: userId });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const fileRecord = user.files.find((f: any) => f.cid === cid);

        if (!fileRecord) {
            return NextResponse.json({ error: "File not found or access denied" }, { status: 404 });
        }

        // Fetch encrypted file from IPFS Gateway
        // Using Pinata Gateway
        const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;
        const response = await fetch(gatewayUrl);

        if (!response.ok) {
            console.error(`Failed to fetch from IPFS: ${response.statusText}`);
            return NextResponse.json({ error: "Failed to fetch file from IPFS" }, { status: 502 });
        }

        const arrayBuffer = await response.arrayBuffer();
        const encryptedBuffer = Buffer.from(arrayBuffer);

        // Decrypt
        // IV is stored as hex string
        const iv = Buffer.from(fileRecord.iv, 'hex');

        let decryptedBuffer;
        try {
            decryptedBuffer = decryptBuffer(encryptedBuffer, iv);
        } catch (decryptionError) {
            console.error("Decryption failed:", decryptionError);
            return NextResponse.json({ error: "Decryption failed" }, { status: 500 });
        }

        return new NextResponse(new Uint8Array(decryptedBuffer), {
            headers: {
                "Content-Type": fileRecord.mimeType || "application/octet-stream",
                "Cache-Control": "private, max-age=3600",
            },
        });

    } catch (error) {
        console.error("Error serving image:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
