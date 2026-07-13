import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../components/Card/Card";
import { Icon } from "../../components/Icon/Icon";
import { loadActiveScore21Match, loadActiveStandardMatch } from "../../storage/activeMatchRepository";
import { loadMatchHistory } from "../../storage/matchHistoryRepository";
import {
  getActiveScore21Summary,
  getActiveStandardSummary,
  getLatestHistorySummary,
  type HomeMatchSummary
} from "./homePageSummary";
import "./HomePage.css";

const menuItems = [
  {
    icon: "book",
    title: "Belajar Rules",
    text: "Pelajari aturan dasar padel untuk pemula.",
    to: "/rules"
  },
  {
    icon: "history",
    title: "Riwayat Pertandingan",
    text: "Lihat hasil pertandingan sebelumnya.",
    to: "/history"
  },
  {
    icon: "help",
    title: "Cara Menggunakan",
    text: "Mulai dari memilih sistem skor lalu catat poin dari scoreboard.",
    to: "/rules"
  }
];

export function HomePage() {
  const [activeMatches, setActiveMatches] = useState<HomeMatchSummary[]>([]);
  const [latestMatch, setLatestMatch] = useState<HomeMatchSummary | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    Promise.all([loadActiveScore21Match(), loadActiveStandardMatch(), loadMatchHistory()])
      .then(([score21Match, standardMatch, matchHistory]) => {
        if (!isMounted) {
          return;
        }

        setActiveMatches(
          [getActiveScore21Summary(score21Match), getActiveStandardSummary(standardMatch)].filter(isHomeMatchSummary)
        );
        setLatestMatch(getLatestHistorySummary(matchHistory[0] ?? null));
      })
      .catch(() => {
        if (isMounted) {
          setActiveMatches([]);
          setLatestMatch(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoaded(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="home-page page-stack">
      <section className="home-page__intro" aria-labelledby="home-title">
        <h2 id="home-title">Siap bermain padel?</h2>
        <p>Hitung skor pertandingan dan pelajari aturan padel dengan mudah.</p>
      </section>

      <Link className="button button--primary home-page__cta" to="/match/new">
        <Icon filled name="sports_tennis" />
        <span>Mulai Pertandingan</span>
      </Link>

      {activeMatches.length > 0 ? (
        <section className="home-page__continue" aria-labelledby="continue-title">
          <div className="home-section-heading">
            <div>
              <span className="eyebrow">Tersimpan offline</span>
              <h2 id="continue-title">Lanjutkan pertandingan</h2>
            </div>
          </div>
          <div className="home-page__continue-list">
            {activeMatches.map((match) => (
              <HomeSummaryCard key={match.id} summary={match} actionLabel="Lanjutkan" />
            ))}
          </div>
        </section>
      ) : null}

      <section className="home-page__menu" aria-label="Menu utama">
        {menuItems.map((item) => (
          <Link className="home-menu-card" key={item.title} to={item.to}>
            <span className="home-menu-card__icon">
              <Icon name={item.icon} />
            </span>
            <span className="home-menu-card__body">
              <strong>{item.title}</strong>
              <span>{item.text}</span>
            </span>
          </Link>
        ))}
      </section>

      <section className="page-stack">
        <h2 className="section-title">Pertandingan Terakhir</h2>
        {latestMatch !== null ? (
          <HomeSummaryCard summary={latestMatch} actionLabel="Lihat Riwayat" />
        ) : (
          <Card as="div" className="empty-state">
            <Icon className="empty-state__icon" name={isLoaded ? "sentiment_dissatisfied" : "history"} />
            <strong>{isLoaded ? "Belum ada pertandingan yang tersimpan." : "Memuat pertandingan terakhir..."}</strong>
            <span>{isLoaded ? "Mulai pertandingan pertama kamu." : "Data offline sedang disiapkan."}</span>
          </Card>
        )}
      </section>
    </div>
  );
}

function HomeSummaryCard({ summary, actionLabel }: { summary: HomeMatchSummary; actionLabel: string }) {
  return (
    <Link className="home-summary-card" to={summary.to}>
      <span className="home-summary-card__icon">
        <Icon name={summary.icon} />
      </span>
      <span className="home-summary-card__body">
        <span className="eyebrow">{summary.modeLabel}</span>
        <strong>{summary.title}</strong>
        <span>{summary.subtitle}</span>
      </span>
      <span className="home-summary-card__stat" aria-label={`${summary.statLabel} ${summary.statValue}`}>
        <span>{summary.statLabel}</span>
        <strong>{summary.statValue}</strong>
      </span>
      <span className="home-summary-card__action">
        {actionLabel}
        <Icon name="chevron_right" />
      </span>
    </Link>
  );
}

function isHomeMatchSummary(summary: HomeMatchSummary | null): summary is HomeMatchSummary {
  return summary !== null;
}
