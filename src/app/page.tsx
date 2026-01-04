"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="text-center">
            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-fade-in">
              Secure Your Memories
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Store your images with military-grade encryption on IPFS. Your privacy, fully decentralized.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              {isSignedIn ? (
                <Link
                  href="/dashboard"
                  className="px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 hover:shadow-xl"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    className="px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 hover:shadow-xl"
                  >
                    Get Started
                  </Link>
                  <a
                    href="#features"
                    className="px-8 py-4 bg-white/70 backdrop-blur-sm text-gray-700 font-semibold rounded-xl border-2 border-gray-300 hover:border-purple-500 hover:bg-white transition-all duration-200"
                  >
                    Learn More
                  </a>
                </>
              )}
            </div>

            {/* Hero Visual */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 transform hover:scale-[1.02] transition-all duration-300">
                <div className="aspect-video bg-linear-to-br from-blue-400 via-purple-400 to-pink-400 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <svg
                    className="w-32 h-32 text-white/80"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-sm font-medium">
                    Encrypted
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-800">
              Why Crypted Vault?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of secure image storage with cutting-edge technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">End-to-End Encryption</h3>
              <p className="text-gray-600">
                Your images are encrypted before leaving your device. Only you hold the keys.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Decentralized Storage</h3>
              <p className="text-gray-600">
                Store on IPFS for permanent, censorship-resistant storage across the network.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-linear-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Lightning Fast</h3>
              <p className="text-gray-600">
                Upload and retrieve your images instantly with our optimized infrastructure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl p-12 text-white">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Ready to Secure Your Images?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands protecting their memories with military-grade encryption
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-10 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200"
            >
              Start For Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
