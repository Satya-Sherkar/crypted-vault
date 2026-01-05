import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData();
        const file: File | null = data.get("file") as unknown as File;

        if (!file) {
            return NextResponse.json({ error: "File required" }, { status: 400 });
        }

        const uploadData = new FormData();
        uploadData.append("file", file);

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
        return NextResponse.json(json, { status: 200 });

    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
