import { Link, useLocation } from "react-router-dom";
import { getPublicAssetUrl } from "../../app/assets";
import { Icon } from "../Icon/Icon";
import "./AppHeader.css";

const titleByPath: Record<string, string> = {
  "/": "SkorPadelKu",
  "/match/new": "Pertandingan",
  "/rules": "Rules",
  "/history": "Riwayat",
  "/info": "Info",
  "/settings": "Info"
};

export function AppHeader() {
  const { pathname } = useLocation();
  const title = titleByPath[pathname] ?? "SkorPadelKu";

  return (
    <header className="app-header">
      <Link className="app-header__logo" to="/" aria-label="Ke Beranda">
        <img src={getPublicAssetUrl("icons/skorpadelku-icon-192.png")} alt="" />
      </Link>
      <h1 className="app-header__title">{title}</h1>
      <Link className="app-header__icon-button" to="/info" aria-label="Buka info aplikasi">
        <Icon name="info" />
      </Link>
    </header>
  );
}
