import { Icon } from "../../components/Icon/Icon";
import "./RotateDevicePage.css";

export function RotateDevicePage() {
  return (
    <main className="rotate-page" aria-labelledby="rotate-title">
      <Icon className="rotate-page__icon" filled name="screen_rotation" />
      <h1 id="rotate-title">Mohon Putar Perangkat</h1>
      <p>Scoreboard hanya tampil dalam mode lanskap. Putar HP ke posisi mendatar atau lebarkan jendela browser.</p>
    </main>
  );
}
