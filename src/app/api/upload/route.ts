import { NextResponse, type NextRequest } from "next/server";
import { auth } from '@clerk/nextjs/server';
import { encryptBuffer } from "@/lib/encryption";
import User from "@/models/User";
import dbConnect from "@/lib/db";

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.formData();
        const file: File | null = data.get("file") as unknown as File;

        if (!file) {
            return NextResponse.json({ error: "File required" }, { status: 400 });
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Encrypt the buffer
        const { encryptedData, iv } = encryptBuffer(buffer);

        // Prepare for Pinata upload
        const uploadData = new FormData();
        // Create a Blob from the encrypted data
        const blob = new Blob([encryptedData]);
        uploadData.append("file", blob, file.name);

        const check = await fetch("https://api.pinata.cloud/data/testAuthentication", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${process.env.PINATA_JWT}`,
            },
        });

        if (!check.ok) {
            console.error("Pinata Auth Failed:", check.statusText);
            return NextResponse.json({ error: "Pinata Authentication Failed" }, { status: 500 });
        }

        const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.PINATA_JWT}`,
            },
            body: uploadData,
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Pinata Upload Error:", errorText);
            return NextResponse.json({ error: "Failed to upload to Pinata", details: errorText }, { status: 500 });
        }

        const json = await res.json();
        const cid = json.IpfsHash;

        // Save to Database
        await dbConnect();
        const updatedUser = await User.findOneAndUpdate(
            { clerkId: userId },
            {
                $push: {
                    files: {
                        cid: cid,
                        iv: iv.toString('hex'),
                        mimeType: file.type,
                        originalName: file.name,
                        createdAt: new Date(),
                    },
                },
            },
            { new: true }
        );

        if (!updatedUser) {
            // Fallback: if user doesn't exist (shouldn't happen if auth is working and user created on signup), 
            // maybe create one? or just error. For now, error.
            console.error("User not found for ID:", userId);
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, cid, message: "File encrypted and uploaded successfully" }, { status: 200 });

    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
