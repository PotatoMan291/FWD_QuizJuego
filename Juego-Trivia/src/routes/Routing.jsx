import {
    Routes,
    Route
} from "react-router-dom";

import Home
    from "../pages/Home";

import Game
    from "../pages/Game";

import Results
    from "../pages/Results";

import ScoreBoard
    from "../pages/ScoreBoard";

function Routing() {
    return (
        <Routes>
            <Route
                path="/"
                element={<Home />}
            />

            <Route
                path="/juego/:difficulty"
                element={<Game />}
            />

            <Route
                path="/resultados"
                element={<Results />}
            />

            <Route
                path="/puntajes"
                element={<ScoreBoard />}
            />

            <Route
                path="*"
                element={<Home />}
            />
        </Routes>
    );
}

export default Routing;