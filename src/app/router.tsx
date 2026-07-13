import { createHashRouter, Navigate } from "react-router-dom";
import { App } from "./App";
import { OrientationGuard } from "../components/OrientationGuard/OrientationGuard";
import { HistoryPage } from "../pages/HistoryPage/HistoryPage";
import { HomePage } from "../pages/HomePage/HomePage";
import { NewMatchPage } from "../pages/NewMatchPage/NewMatchPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { RulesPage } from "../pages/RulesPage/RulesPage";
import { Score21Page } from "../pages/Score21Page/Score21Page";
import { SettingsPage } from "../pages/SettingsPage/SettingsPage";
import { StandardScorePage } from "../pages/StandardScorePage/StandardScorePage";

export const router: ReturnType<typeof createHashRouter> = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "match/new", element: <NewMatchPage /> },
      { path: "rules", element: <RulesPage /> },
      { path: "history", element: <HistoryPage /> },
      { path: "info", element: <SettingsPage /> },
      { path: "settings", element: <Navigate replace to="/info" /> }
    ]
  },
  {
    path: "/match/score-21",
    element: (
      <OrientationGuard>
        <Score21Page />
      </OrientationGuard>
    )
  },
  {
    path: "/match/standard",
    element: (
      <OrientationGuard>
        <StandardScorePage />
      </OrientationGuard>
    )
  },
  { path: "*", element: <NotFoundPage /> }
]);
