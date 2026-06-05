import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      style={{
        padding: "1rem",
        borderBottom:
          "1px solid #333"
      }}
    >
      <Link to="/">
        Home
      </Link>

      {" | "}

      <Link to="/launch">
        Launch
      </Link>

      {" | "}

      <Link to="/explore">
        Explore
      </Link>
    </nav>
  );
}
