

import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/header";
import Providers from "./web3Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crypted Vault",
  description: "A secure vault for your encrypted data with IPFS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <Providers>
        <html lang="en">
          <body>
            <Header />
            {children}
          </body>
        </html>
      </Providers>
    </ClerkProvider>
  );
}
