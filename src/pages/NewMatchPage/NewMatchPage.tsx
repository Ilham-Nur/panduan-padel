import { Link } from "react-router-dom";
import { Icon } from "../../components/Icon/Icon";
import "./NewMatchPage.css";

const scoreModes = [
  {
    to: "/match/score-21",
    icon: "counter_1",
    eyebrow: "Komunitas",
    title: "Skor 21",
    text: "Satu reli satu poin, selesai saat total reli mencapai 21."
  },
  {
    to: "/match/standard",
    icon: "scoreboard",
    eyebrow: "Padel",
    title: "Padel Standar",
    text: "0, 15, 30, 40, deuce, advantage, game, set, dan tie-break."
  }
];

export function NewMatchPage() {
  return (
    <div className="new-match page-stack">
      <section className="page-heading">
        <p className="eyebrow">Sistem skor</p>
        <h2>Pilih format pertandingan</h2>
        <p>Nama pemain dan servis pertama diatur langsung di scoreboard.</p>
      </section>

      <section className="score-mode-list" aria-label="Pilihan sistem skor">
        {scoreModes.map((mode) => (
          <Link className="score-mode-card" key={mode.title} to={mode.to}>
            <span className="score-mode-card__icon">
              <Icon name={mode.icon} />
            </span>
            <span className="score-mode-card__content">
              <span className="eyebrow">{mode.eyebrow}</span>
              <strong>{mode.title}</strong>
              <span>{mode.text}</span>
            </span>
            <Icon className="score-mode-card__arrow" name="arrow_forward" />
          </Link>
        ))}
      </section>
    </div>
  );
}
