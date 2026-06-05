import Navbar from
"../components/layout/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "2rem"
        }}
      >
        <h1>
          TrustFUN V2
        </h1>

        <p>
          Launch Solana Meme
          Coins Easily.
        </p>
      </div>
    </>
  );
}
