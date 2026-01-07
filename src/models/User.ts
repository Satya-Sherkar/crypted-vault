import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
    {
        clerkId: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        files: [
            {
                cid: { type: String, required: true },
                iv: { type: String, required: true },
                mimeType: { type: String, required: true },
                originalName: { type: String, required: true },
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

const User = models.User || model('User', UserSchema);

export default User;
