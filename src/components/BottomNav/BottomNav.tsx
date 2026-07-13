import { NavLink } from "react-router-dom";
import { Icon } from "../Icon/Icon";
import "./BottomNav.css";

const items = [
  { to: "/", icon: "home", label: "Beranda", end: true },
  { to: "/match/new", icon: "sports_score", label: "Pertandingan" },
  { to: "/rules", icon: "gavel", label: "Rules" },
  { to: "/history", icon: "history", label: "Riwayat" }
];

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navigasi utama">
      {items.map((item) => (
        <NavLink
          className={({ isActive }) => `bottom-nav__item ${isActive ? "is-active" : ""}`}
          end={item.end}
          key={item.to}
          to={item.to}
        >
          {({ isActive }) => (
            <>
              <Icon filled={isActive} name={item.icon} />
              <span>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
