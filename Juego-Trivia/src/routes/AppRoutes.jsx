import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Game from "../pages/Game";
import Leaderboard from "../pages/Leaderboard";
import Results from "../pages/Results";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/game/:level" element={<Game />} />

      <Route path="/leaderboard" element={<Leaderboard />} />

      <Route path="/results/:id" element={<Results />} />

      <Route
        path="*"
        element={
          <main className="not-found">
            <h1>404</h1>
            <p>La página que buscas no existe.</p>
          </main>
        }
      />
    </Routes>
  );
}

export default AppRoutes;