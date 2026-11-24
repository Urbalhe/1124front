import { useState } from "react";
import type { Car } from "../../assets/type/types";
import CarTable from "../cars/CarTable";

interface UserPageProps {
  cars: Car[];
}

function UserPage({ cars }: UserPageProps) {
  const [actionError, setActionError] = useState("");

  return (
    <section>
      <div className="role-banner user-banner">
        <span className="banner-icon">F</span>
        <div><strong>Felhasználói nézet</strong><p>Az autók adatait megtekintheted, módosításra nincs jogosultságod.</p></div>
        <span className="permission-pill">CSAK OLVASÁS</span>
      </div>
      {actionError && <div className="inline-error" role="alert">{actionError}</div>}
      <div className="section-heading compact-heading">
        <div><div className="section-kicker">ADATBÁZIS</div><h2>Járművek <span className="subtle-count">{cars.length} rekord</span></h2></div>
      </div>
      <div className="table-card">
        <CarTable cars={cars} canManage={false} onActionError={setActionError} />
        <div className="table-footer"><span>{cars.length} jármű megjelenítve</span><span className="permission-note"><span className="permission-dot user-dot" /> Felhasználói jogosultság</span></div>
      </div>
    </section>
  );
}

export default UserPage;
