"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Join Crypted Vault
          </h1>
          <p className="text-gray-600 text-lg">
            Create your account to start securing your memories
          </p>
        </div>

        {/* Sign Up Card */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 font-medium transition-all duration-200 hover:border-blue-400",
                socialButtonsBlockButtonText: "font-medium",
                formButtonPrimary:
                  "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl normal-case",
                footerActionLink: "text-blue-600 hover:text-purple-600 font-medium",
                formFieldInput:
                  "border-2 border-gray-300 focus:border-blue-500 rounded-lg transition-colors",
                formFieldLabel: "text-gray-700 font-medium",
                identityPreviewText: "text-gray-700",
                identityPreviewEditButton: "text-blue-600 hover:text-purple-600",
                dividerLine: "bg-gray-300",
                dividerText: "text-gray-500",
                otpCodeFieldInput:
                  "border-2 border-gray-300 focus:border-blue-500 rounded-lg",
              },
              layout: {
                socialButtonsPlacement: "top",
                socialButtonsVariant: "blockButton",
              },
            }}
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
          />
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <a
            href="/sign-in"
            className="text-blue-600 hover:text-purple-600 font-semibold transition-colors"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
