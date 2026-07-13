import { Link } from "react-router-dom";
import { Icon } from "../components/Icon/Icon";

export function NotFoundPage() {
  return (
    <main className="not-found-page">
      <Icon filled name="sports_tennis" />
      <h1>Halaman tidak ditemukan</h1>
      <Link className="button button--primary" to="/">
        Kembali ke Beranda
      </Link>
    </main>
  );
}
