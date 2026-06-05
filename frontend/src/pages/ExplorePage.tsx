import Navbar from
"../components/layout/Navbar";

export default function ExplorePage() {
  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "2rem"
        }}
      >
        <h1>
          Explore Tokens
        </h1>

        <p>
          Trending launches
          coming next.
        </p>
      </div>
    </>
  );
}
