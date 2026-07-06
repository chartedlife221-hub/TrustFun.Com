import { createContext, ReactNode, useContext, useMemo, useState } from "react";

// Mock wallet state only. Real Solana wallet-adapter integration (connect,
// sign, send transactions against devnet/mainnet) is Near-term scope — it
// needs a provider tree, RPC endpoint config, and a real signing flow that
// don't belong in a first pass focused on the three MVP journeys' UI/UX.
// This context exists so LaunchPage can require "a wallet" before minting a
// draft, matching the real product's eventual gate, without depending on
// live network calls yet.

interface MockWallet {
  connected: boolean;
  address: string | null;
  connect: () => void;
  disconnect: () => void;
}

const WalletContext = createContext<MockWallet | undefined>(undefined);

function randomMockAddress(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let head = "";
  let tail = "";
  for (let i = 0; i < 4; i++) head += chars[Math.floor(Math.random() * chars.length)];
  for (let i = 0; i < 4; i++) tail += chars[Math.floor(Math.random() * chars.length)];
  return `${head}...${tail}`;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);

  const value = useMemo<MockWallet>(
    () => ({
      connected: address !== null,
      address,
      connect: () => setAddress(randomMockAddress()),
      disconnect: () => setAddress(null),
    }),
    [address]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet(): MockWallet {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
