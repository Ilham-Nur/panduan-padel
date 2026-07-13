import { getPublicAssetUrl } from "../../app/assets";
import { Card } from "../../components/Card/Card";
import { Icon } from "../../components/Icon/Icon";
import communityLogo from "../../../assets/the-padel$-logo.jpeg";
import "./SettingsPage.css";

export function SettingsPage() {
  return (
    <div className="info-page page-stack">
      <section className="page-heading">
        <p className="eyebrow">Info</p>
        <h2>Info Aplikasi</h2>
        <p>Ringkasan aplikasi, dukungan komunitas, dan informasi pengembang.</p>
      </section>

      <Card as="section" className="info-hero-card" aria-label="Brand aplikasi">
        <img className="info-hero-card__logo" src={getPublicAssetUrl("brand/skorpadelku-logo.png")} alt="SkorPadelKu" />
        <div className="info-hero-card__body">
          <span className="eyebrow">Versi 0.1.0</span>
          <h3>SkorPadelKu</h3>
          <p>Skor dan rules padel untuk pemula, dibuat cepat dipakai di lapangan dan tetap siap offline.</p>
        </div>
      </Card>

      <Card as="section" className="info-section-card" aria-label="Tentang aplikasi">
        <div className="info-section-card__heading">
          <span className="list-card__icon">
            <Icon name="mobile_friendly" />
          </span>
          <div>
            <span className="eyebrow">Tentang</span>
            <strong>Aplikasi scoring padel</strong>
          </div>
        </div>
        <div className="info-feature-list">
          <div>
            <span className="info-feature-list__badge" aria-hidden="true">
              21
            </span>
            <span>Skor 21 dan Padel Standar</span>
          </div>
          <div>
            <span className="info-feature-list__badge" aria-hidden="true">
              R
            </span>
            <span>Panduan rules untuk pemula</span>
          </div>
          <div>
            <span className="info-feature-list__badge" aria-hidden="true">
              OFF
            </span>
            <span>Riwayat dan match aktif tersimpan offline</span>
          </div>
        </div>
      </Card>

      <Card as="section" className="info-support-card" aria-label="Dukungan komunitas">
        <div className="info-support-card__media">
          <img src={communityLogo} alt="The Padel$" />
        </div>
        <div className="info-support-card__body">
          <span className="eyebrow">Community Support</span>
          <strong>The Padel$</strong>
        </div>
      </Card>
    </div>
  );
}
