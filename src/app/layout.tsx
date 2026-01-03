import type { Metadata } from "next";
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
