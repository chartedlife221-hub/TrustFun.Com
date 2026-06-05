import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          TrustFun
        </Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">Home</Link>
          </li>
          <li className="navbar-item">
            <Link to="/launch" className="navbar-link">Launch</Link>
          </li>
          <li className="navbar-item">
            <Link to="/explore" className="navbar-link">Explore</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
