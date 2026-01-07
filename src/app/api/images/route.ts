import { NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server';
import User from "@/models/User";
import dbConnect from "@/lib/db";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findOne({ clerkId: userId });

        if (!user) {
            return NextResponse.json({ files: [] });
        }

        // Return files sorted by newest first
        const files = user.files.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json({ files });
    } catch (error) {
        console.error("Error fetching images:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
