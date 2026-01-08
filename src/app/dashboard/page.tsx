"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";

export default function Dashboard() {
    const { user } = useUser();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [files, setFiles] = useState<any[]>([]);
    const [loadingImages, setLoadingImages] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    const handleView = (cid: string) => {
        window.open(`/api/image/${cid}`, '_blank');
    };

    const handleDownload = async (cid: string, filename: string) => {
        try {
            setProcessing(cid);
            const response = await fetch(`/api/image/${cid}`);
            if (!response.ok) throw new Error("Download failed");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Download error:", error);
            alert("Failed to download image");
        } finally {
            setProcessing(null);
        }
    };

    const handleDelete = async (cid: string) => {
        if (!confirm("Are you sure you want to delete this image? This cannot be undone.")) return;

        try {
            setProcessing(cid);
            const response = await fetch(`/api/image/${cid}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error("Delete failed");
            }

            // Remove from local state immediately
            setFiles(prev => prev.filter(f => f.cid !== cid));
            alert("Image deleted successfully");
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete image");
        } finally {
            setProcessing(null);
        }
    };

    const fetchImages = async () => {
        try {
            const res = await fetch("/api/images");
            if (res.ok) {
                const data = await res.json();
                setFiles(data.files || []);
            }
        } catch (error) {
            console.error("Failed to fetch images", error);
        } finally {
            setLoadingImages(false);
        }
    };

    useState(() => {
        fetchImages();
    });

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newFiles = Array.from(files);
            setSelectedFiles((prev) => {
                const combined = [...prev, ...newFiles];
                if (combined.length > 5) {
                    alert("You can only upload up to 5 files at a time.");
                    return combined.slice(0, 5);
                }
                return combined;
            });
            // Reset input value to allow selecting the same file again if needed (though we just accumulated it)
            event.target.value = "";
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
            const newFiles = Array.from(files);
            setSelectedFiles((prev) => {
                const combined = [...prev, ...newFiles];
                if (combined.length > 5) {
                    alert("You can only upload up to 5 files at a time.");
                    return combined.slice(0, 5);
                }
                return combined;
            });
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleUploadToIpfs = async () => {
        if (selectedFiles.length === 0) return;

        setUploading(true);
        try {
            const uploadPromises = selectedFiles.map(async (file) => {
                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.error || `Upload failed for ${file.name}`);
                }

                return res.json();
            });

            await Promise.all(uploadPromises);

            alert("All files uploaded successfully!");
            setSelectedFiles([]);
            fetchImages(); // Refresh the list
        } catch (error) {
            console.error(error);
            alert("Some uploads failed. Check console for details.");
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
                                <div className="mt-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-gray-700 font-semibold">
                                            Selected Files ({selectedFiles.length})
                                        </h3>
                                        <button
                                            onClick={() => setSelectedFiles([])}
                                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                                        >
                                            Clear all
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                                        {selectedFiles.map((file, index) => {
                                            const previewUrl = URL.createObjectURL(file);
                                            // Note: In a real app with many files, we should manage these URLs with useEffect to revoke them
                                            // avoiding memory leaks. For simplicity in this render loop we might leak if re-renders happen often without cleanup.
                                            // Let's refactor to a safer component approach or cleanup in useEffect.
                                            // Actually, to do it right, let's just stick to the plan:
                                            return (
                                                <div key={index} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                                    <img
                                                        src={previewUrl}
                                                        alt={file.name}
                                                        className="w-full h-full object-cover"
                                                        onLoad={() => URL.revokeObjectURL(previewUrl)} // Revoke after load to save memory, simple trick
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedFiles(prev => prev.filter((_, i) => i !== index));
                                                            }}
                                                            className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-transform hover:scale-110"
                                                            title="Remove file"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                                                        <p className="text-white text-xs truncate">
                                                            {file.name}
                                                        </p>
                                                        <p className="text-gray-300 text-[10px]">
                                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            onClick={handleUploadToIpfs}
                                            disabled={uploading}
                                            className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                                        >
                                            {uploading ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Uploading {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                    Upload {selectedFiles.length} File{selectedFiles.length !== 1 ? 's' : ''} to IPFS
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Gallery Section */}
                <div>
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Encrypted Images</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loadingImages ? (
                            // Loading Skeleton
                            [1, 2, 3].map((i) => (
                                <div key={i} className="animate-pulse bg-white/50 rounded-xl h-64 border border-white/20"></div>
                            ))
                        ) : files.length === 0 ? (
                            /* Empty State */
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
                        ) : (
                            /* Image Grid */
                            files.map((file) => (
                                <div
                                    key={file.cid}
                                    className="group bg-white/70 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                                >
                                    <div className="aspect-video bg-gray-100 relative overflow-hidden flex items-center justify-center">
                                        {/* Using the secure API route to display the image */}
                                        <img
                                            src={`/api/image/${file.cid}`}
                                            alt={file.originalName}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                            <button
                                                onClick={() => handleView(file.cid)}
                                                className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg transform hover:scale-110"
                                                title="View"
                                                disabled={processing === file.cid}
                                            >
                                                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDownload(file.cid, file.originalName)}
                                                className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg transform hover:scale-110"
                                                title="Download"
                                                disabled={processing === file.cid}
                                            >
                                                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(file.cid)}
                                                className="p-3 bg-red-500/90 rounded-full hover:bg-red-600 transition-colors shadow-lg transform hover:scale-110"
                                                title="Delete"
                                                disabled={processing === file.cid}
                                            >
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-semibold text-gray-800 mb-1 truncate" title={file.originalName}>
                                            {file.originalName}
                                        </h4>
                                        <div className="flex items-center justify-between mt-2">
                                            <p className="text-sm text-gray-500">
                                                {new Date(file.createdAt).toLocaleDateString()}
                                            </p>
                                            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                                Encrypted
                                            </span>
                                        </div>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-xs text-gray-400 font-mono truncate max-w-[150px]" title={file.cid}>
                                                {file.cid}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
