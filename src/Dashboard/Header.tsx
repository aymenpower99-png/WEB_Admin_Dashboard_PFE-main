interface HeaderProps { dark: boolean; }
import './travelsync-design-system.css'
export default function Header({ dark: _ }: HeaderProps) {
  return (
    <div className="ts-page-header">
      <div>
        <div className="ts-page-title-row">
          <h1 className="ts-page-title">Admin dashboard</h1>
          <span className="ts-live-badge">● Live</span>
        </div>
        <p className="ts-page-subtitle">Monitor trips, users and payments in real time.</p>
      </div>
    </div>
  );
}