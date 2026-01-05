"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useRef } from "react";

export default function Dashboard() {
    const { user } = useUser();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setSelectedFiles(Array.from(files));
        }
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragging(false);
        const files = event.dataTransfer.files;
        if (files) {
            setSelectedFiles(Array.from(files));
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleUploadToIpfs = async () => {
        if (selectedFiles.length === 0) return;

        setUploading(true);
        try {
            for (const file of selectedFiles) {
                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.error || "Upload failed");
                }

                const data = await res.json();
                console.log("Uploaded CID:", data.IpfsHash);
                // Ideally add to a list of uploaded files here to display
            }
            alert("Upload successful!");
            setSelectedFiles([]);
        } catch (error) {
            console.error(error);
            alert("Upload failed. Check console for details.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-purple-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section */}
                <div className="mb-12 text-center">
                    <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Welcome back{user?.firstName ? `, ${user.firstName}` : ""}!
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Securely store and manage your encrypted images on IPFS. Your privacy, our priority.
                    </p>
                </div>

                {/* Upload Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Upload Images</h2>
                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-300">
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${isDragging
                                ? "border-purple-500 bg-purple-50/50 scale-[1.02]"
                                : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/30"
                                }`}
                        >
                            <div className="mb-6">
                                <div className="w-20 h-20 mx-auto mb-4 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                    <svg
                                        className="w-10 h-10 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    {isDragging ? "Drop your images here" : "Drag & drop your images"}
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    or click the button below to browse
                                </p>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            <button
                                onClick={handleUploadClick}
                                className="px-8 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 hover:shadow-xl"
                            >
                                Choose Files
                            </button>

                            {selectedFiles.length > 0 && (
                                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-green-700 font-medium">
                                        ✓ {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""} selected
                                    </p>
                                    <div className="mt-2 space-y-1">
                                        {selectedFiles.map((file, index) => (
                                            <p key={index} className="text-sm text-green-600">
                                                {file.name}
                                            </p>
                                        ))}
                                    </div>
                                    <button
                                        onClick={handleUploadToIpfs}
                                        disabled={uploading}
                                        className="mt-4 px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {uploading ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Uploading...
                                            </>
                                        ) : (
                                            "Upload to IPFS"
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Gallery Section */}
                <div>
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Encrypted Images</h2>

                    {/* Placeholder for empty state */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Empty State */}
                        <div className="col-span-full">
                            <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-12 border border-white/20 text-center">
                                <div className="w-24 h-24 mx-auto mb-6 bg-linear-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-12 h-12 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                    No images yet
                                </h3>
                                <p className="text-gray-500">
                                    Upload your first image to get started with encrypted storage on IPFS
                                </p>
                            </div>
                        </div>

                        {/* Example Image Cards (for demonstration) */}
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="group bg-white/70 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                            >
                                <div className="aspect-video bg-linear-to-br from-blue-400 via-purple-400 to-pink-400 relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg
                                            className="w-16 h-16 text-white/50"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                        <button className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg">
                                            <svg
                                                className="w-5 h-5 text-gray-700"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                        </button>
                                        <button className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg">
                                            <svg
                                                className="w-5 h-5 text-gray-700"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                />
                                            </svg>
                                        </button>
                                        <button className="p-3 bg-red-500/90 rounded-full hover:bg-red-600 transition-colors shadow-lg">
                                            <svg
                                                className="w-5 h-5 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h4 className="font-semibold text-gray-800 mb-1">Example Image {item}</h4>
                                    <p className="text-sm text-gray-500">Encrypted • Stored on IPFS</p>
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-xs text-gray-400">CID: Qm...abc{item}</span>
                                        <span className="text-xs font-medium text-green-600">✓ Secure</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
