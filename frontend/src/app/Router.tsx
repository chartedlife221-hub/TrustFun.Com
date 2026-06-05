import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import HomePage from "../pages/HomePage";
import LaunchPage from "../pages/LaunchPage";
import ExplorePage from "../pages/ExplorePage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/launch"
          element={<LaunchPage />}
        />

        <Route
          path="/explore"
          element={<ExplorePage />}
        />
      </Routes>
    </BrowserRouter>
  );
}
