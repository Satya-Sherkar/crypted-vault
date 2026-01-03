"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia, anvil, mainnet } from "wagmi/chains";

export default getDefaultConfig({
    appName: "Crypted Vault",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    chains: [sepolia, anvil, mainnet],
    ssr: false,
});