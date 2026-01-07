
# Crypted Vault 🔒

> **Secure Your Memories.** Store your images with military-grade encryption on IPFS. Your privacy, fully decentralized.

![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![IPFS](https://img.shields.io/badge/IPFS-Pinata-65C2CB?style=for-the-badge&logo=ipfs&logoColor=white)

## 📖 Overview

**Crypted Vault** is a cutting-edge web application designed to provide the highest level of security for your personal images. By combining **AES encryption** with **decentralized IPFS storage**, we ensure that your data remains private, permanent, and censorship-resistant.

Files are encrypted client-side/server-side (before reaching storage) so that even if the storage provider is compromised, your images remain secure.

## ✨ Key Features

- **🔐 End-to-End Encryption**: Images are encrypted using advanced algorithms before they ever leave your secure environment.
- **🌐 Decentralized Storage**: Leveraging IPFS (via Pinata) for permanent, distributed storage that isn't reliant on a single central server.
- **👤 Secure Authentication**: Seamless and secure sign-in experience powered by Clerk.
- **⚡ Modern Dashboard**: A beautiful, responsive dashboard to manage, view, and organize your encrypted vault.
- **🎨 Glassmorphism UI**: A stunning, modern interface built with the latest web design trends using Tailwind CSS 4.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Storage**: [Pinata](https://www.pinata.cloud/) (IPFS)

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js 18+
- pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Satya-Sherkar/crypted-vault.git
   cd crypted-vault
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory and add the following keys:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   CLERK_WEBHOOK_SIGNING_SECRET=whsec_...

   # MongoDB
   MONGODB_URI=mongodb+srv://...

   # Pinata (IPFS)
   PINATA_JWT=...
   PINATA_API_Key=...
   PINATA_API_Secret=...

   # Encryption
   ENCRYPTION_KEY=your-32-byte-random-string
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
crypted-vault/
├── src/
│   ├── app/              # Next.js App Router pages & API routes
│   │   ├── api/          # Backend API endpoints (upload, auth, etc.)
│   │   ├── dashboard/    # User dashboard
│   │   └── page.tsx      # Landing page
│   ├── components/       # Reusable UI components
│   ├── lib/              # Utility functions (db connection, encryption)
│   └── models/           # Mongoose database models
├── public/               # Static assets
└── ...config files       # Next.js, Tailwind, TypeScript configs
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
