import { Outlet } from "react-router-dom";
import { AppHeader } from "../components/AppHeader/AppHeader";
import { BottomNav } from "../components/BottomNav/BottomNav";

export function App() {
  return (
    <div className="app-shell">
      <AppHeader />
      <main className="app-main">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
