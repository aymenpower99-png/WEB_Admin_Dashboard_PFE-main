interface HeaderProps {
  dark: boolean;
}
import "./travelsync-design-system.css";
import logoLight from "../assets/moviroo light_dark_big.png";
import logoDark from "../assets/moviroo dark_light_big.png";

export default function Header({ dark }: HeaderProps) {
  return (
    <div className="ts-page-header">
      <div className="ts-header-content">
        <div className="ts-page-title-row">
          <img
            src={dark ? logoDark : logoLight}
            alt="Moviroo logo"
            className="ts-header-logo"
          />
          <span className="ts-live-badge">● Live</span>
        </div>
        <p className="ts-page-subtitle">
          Monitor trips, users and payments in real time.
        </p>
      </div>
    </div>
  );
}
