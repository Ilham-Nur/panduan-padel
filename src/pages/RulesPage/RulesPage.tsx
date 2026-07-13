import { Card } from "../../components/Card/Card";
import { Icon } from "../../components/Icon/Icon";
import { ruleCategories } from "../../features/rules/rulesContent";
import "./RulesPage.css";

export function RulesPage() {
  return (
    <div className="page-stack">
      <section className="page-heading">
        <p className="eyebrow">Belajar rules</p>
        <h2>Aturan padel untuk pemula</h2>
        <p>Pilih kategori rules sebelum masuk lapangan.</p>
      </section>

      <section className="rules-list" aria-label="Kategori rules">
        {ruleCategories.map((category) => (
          <Card as="article" className="rules-card" key={category.id}>
            <div className="rules-card__header">
              <span className="rules-card__icon">
                <Icon name={category.icon} />
              </span>
              <div className="rules-card__title">
                <strong>{category.title}</strong>
                <span>{category.summary}</span>
              </div>
            </div>
            <ul>
              {category.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </Card>
        ))}
      </section>
    </div>
  );
}
