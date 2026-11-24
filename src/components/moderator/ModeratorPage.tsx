import { useState } from "react";
import type { Car } from "../../assets/type/types";
import CarTable from "../cars/CarTable";

interface ModeratorPageProps {
  cars: Car[];
  onToggleInsurance: (car: Car) => Promise<void>;
  onAdjustMileage: (car: Car, amount: number) => Promise<void>;
}

function ModeratorPage({ cars, onToggleInsurance, onAdjustMileage }: ModeratorPageProps) {
  const [actionError, setActionError] = useState("");

  return (
    <section>
      <div className="role-banner moderator-banner">
        <span className="banner-icon">M</span>
        <div><strong>Moderátori nézet</strong><p>A járműveket megtekintheted, a biztosítási állapotot és a futásteljesítményt módosíthatod.</p></div>
        <span className="permission-pill">KORLÁTOZOTT JOGOSULTSÁG</span>
      </div>
      <div className="section-heading compact-heading">
        <div><div className="section-kicker">ADATBÁZIS</div><h2>Járművek <span className="subtle-count">{cars.length} rekord</span></h2></div>
      </div>
      {actionError && <div className="inline-error" role="alert">{actionError}</div>}
      <div className="table-card">
        <CarTable cars={cars} canManage onToggleInsurance={onToggleInsurance} onAdjustMileage={onAdjustMileage} onActionError={setActionError} />
        <div className="table-footer"><span>{cars.length} jármű megjelenítve</span><span className="permission-note"><span className="permission-dot moderator-dot" /> Moderátor jogosultság</span></div>
      </div>
    </section>
  );
}

export default ModeratorPage;
