import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Game Trivia
      </Link>

      <div className="navbar-links">
        <Link to="/">Inicio</Link>
        <Link to="/leaderboard">Puntuaciones</Link>
      </div>
    </nav>
  );
}

export default Navbar;