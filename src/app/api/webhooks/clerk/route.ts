import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import dbConnect from '@/lib/db';

export async function POST(req: NextRequest) {
    const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

    if (!SIGNING_SECRET) {
        return NextResponse.json(
            { error: 'Error: Please add CLERK_WEBHOOK_SIGNING_SECRET from Clerk Dashboard to .env or .env.local' },
            { status: 500 }
        );
    }

    let evt: WebhookEvent;

    try {
        evt = await verifyWebhook(req, {
            signingSecret: SIGNING_SECRET,
        });
    } catch (err) {
        console.error('Error: Could not verify webhook:', err);
        return NextResponse.json({ error: 'Verification error', details: err }, { status: 400 });
    }

    const { id } = evt.data;
    const eventType = evt.type;

    if (eventType === 'user.created' || eventType === 'user.updated') {
        const { id, email_addresses, first_name, last_name } = evt.data;
        const primaryEmail = email_addresses[0]?.email_address;

        if (!id || !primaryEmail) {
            return NextResponse.json({ error: 'Invalid user data received' }, { status: 400 });
        }

        try {
            await dbConnect();

            const updateData: any = {
                clerkId: id,
                email: primaryEmail,
                firstName: first_name,
                lastName: last_name,
            };

            await User.findOneAndUpdate(
                { clerkId: id },
                updateData,
                { upsert: true, new: true }
            );

            return NextResponse.json({ message: 'User synced successfully', user: updateData }, { status: 200 });

        } catch (error) {
            console.error('Error syncing user to database:', error);
            return NextResponse.json({ error: 'Database sync failed' }, { status: 500 });
        }
    }

    return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
}
