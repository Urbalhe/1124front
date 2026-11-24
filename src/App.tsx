import { useEffect, useState } from "react";
import { carApi } from "./api/api";
import type { Car, CarDraft } from "./assets/type/types";
import AdminPage from "./components/admin/AdminPage";
import ModeratorPage from "./components/moderator/ModeratorPage";
import UserPage from "./components/user/UserPage";

type Role = "admin" | "moderator" | "user";

const roleDetails: Record<Role, { label: string; description: string; icon: string }> = {
  admin: { label: "Admin", description: "Teljes körű adatkezelés", icon: "A" },
  moderator: { label: "Moderátor", description: "Állapotok és értékek kezelése", icon: "M" },
  user: { label: "Felhasználó", description: "Csak megtekintés", icon: "F" },
};

function App() {
  const [cars, setCars] = useState<Car[]>([]);
  const [role, setRole] = useState<Role>("admin");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    carApi.list()
      .then((data) => {
        if (active) setCars(data);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Nem sikerült betölteni az autókat.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function addCar(draft: CarDraft) {
    const newCar = await carApi.create(draft);
    setCars((current) => [...current, newCar]);
  }

  async function deleteCar(id: Car["id"]) {
    await carApi.remove(id);
    setCars((current) => current.filter((car) => car.id !== id));
  }

  async function toggleInsurance(car: Car) {
    const updatedCar = await carApi.update(car.id, { biztositasVane: !car.biztositasVane });
    setCars((current) => current.map((item) => item.id === car.id ? updatedCar : item));
  }

  async function adjustMileage(car: Car, amount: number) {
    const updatedCar = await carApi.update(car.id, {
      teljesitmeny: Math.max(0, car.teljesitmeny + amount),
    });
    setCars((current) => current.map((item) => item.id === car.id ? updatedCar : item));
  }

  const content = role === "admin"
    ? <AdminPage cars={cars} onAdd={addCar} onDelete={deleteCar} onToggleInsurance={toggleInsurance} onAdjustMileage={adjustMileage} />
    : role === "moderator"
      ? <ModeratorPage cars={cars} onToggleInsurance={toggleInsurance} onAdjustMileage={adjustMileage} />
      : <UserPage cars={cars} />;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="app-container header-inner">
          <a className="brand" href="#" onClick={(event) => event.preventDefault()}>
            <span className="brand-mark">G</span>
            <span>Garázs<span className="brand-light">.kezelő</span></span>
          </a>
          <div className="header-note">
            <span className="online-dot" />
            Járműnyilvántartó rendszer
          </div>
          <div className="profile-chip">
            <span className="profile-avatar">{roleDetails[role].icon}</span>
            <span className="profile-label">{roleDetails[role].label}</span>
          </div>
        </div>
      </header>

      <main className="app-container app-main">
        <section className="page-intro">
          <div>
            <div className="eyebrow">JÁRMŰKEZELÉS <span>·</span> 2026</div>
            <h1>Autónyilvántartás</h1>
            <p className="intro-copy">A járművek adatai és kezelése egy helyen.</p>
          </div>
          <div className="record-count">
            <span className="count-number">{cars.length.toString().padStart(2, "0")}</span>
            <span className="count-label">nyilvántartott autó</span>
          </div>
        </section>

        <nav className="role-switcher" aria-label="Nézet kiválasztása">
          {(Object.keys(roleDetails) as Role[]).map((item) => (
            <button
              key={item}
              type="button"
              className={`role-tab ${role === item ? "active" : ""}`}
              onClick={() => setRole(item)}
              aria-current={role === item ? "page" : undefined}
            >
              <span className={`role-icon role-icon-${item}`}>{roleDetails[item].icon}</span>
              <span className="role-tab-copy">
                <span className="role-tab-title">{roleDetails[item].label}</span>
                <span className="role-tab-description">{roleDetails[item].description}</span>
              </span>
              {role === item && <span className="role-active-dot" />}
            </button>
          ))}
        </nav>

        {error && (
          <div className="inline-error app-error" role="alert">
            <span className="error-label">Hiba:</span> {error}
            <span className="error-hint">Ellenőrizd, hogy fut-e a JSON Server (npm run jsonserver).</span>
          </div>
        )}
        {loading ? (
          <div className="loading-panel">
            <span className="loading-spinner" role="status" />
            <span>Autók betöltése…</span>
          </div>
        ) : !error ? content : null}
      </main>
      <footer className="app-footer">
        <div className="app-container footer-inner">
          <span>Garázs.kezelő <span className="footer-divider">/</span> Járműnyilvántartás</span>
          <span>Adatok a helyi JSON adatbázisból</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
