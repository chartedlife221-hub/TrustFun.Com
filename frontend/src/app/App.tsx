import Router from "./Router";
import { WalletProvider } from "../contexts/WalletContext";

export default function App() {
  return (
    <WalletProvider>
      <Router />
    </WalletProvider>
  );
}
