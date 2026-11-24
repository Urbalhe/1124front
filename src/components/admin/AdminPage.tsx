import { useState, type FormEvent } from "react";
import type { Car, CarDraft } from "../../assets/type/types";
import CarTable from "../cars/CarTable";

interface AdminPageProps {
  cars: Car[];
  onAdd: (car: CarDraft) => Promise<void>;
  onDelete: (id: Car["id"]) => Promise<void>;
  onToggleInsurance: (car: Car) => Promise<void>;
  onAdjustMileage: (car: Car, amount: number) => Promise<void>;
}

function AdminPage({ cars, onAdd, onDelete, onToggleInsurance, onAdjustMileage }: AdminPageProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [draft, setDraft] = useState<CarDraft>({
    marka: "",
    tipus: "",
    teljesitmeny: 0,
    muszakiVizsga: "",
    biztositasVane: false,
    uzemanyag: "Benzin",
    extrak: [],
  });
  const [extrasInput, setExtrasInput] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onAdd({ ...draft, extrak: extrasInput.split(",").map((item) => item.trim()).filter(Boolean) });
      setDraft({ marka: "", tipus: "", teljesitmeny: 0, muszakiVizsga: "", biztositasVane: false, uzemanyag: "Benzin", extrak: [] });
      setExtrasInput("");
      setIsFormOpen(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Az autó mentése nem sikerült.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <div className="summary-grid">
        <div className="summary-card"><span className="summary-icon summary-blue">▤</span><span className="summary-label">Összes jármű</span><strong>{cars.length}</strong><span className="summary-foot">nyilvántartásban</span></div>
        <div className="summary-card"><span className="summary-icon summary-green">✓</span><span className="summary-label">Biztosított</span><strong>{cars.filter((car) => car.biztositasVane).length}</strong><span className="summary-foot">aktív biztosítással</span></div>
        <div className="summary-card"><span className="summary-icon summary-amber">◷</span><span className="summary-label">Átlagos futás</span><strong>{cars.length ? Math.round(cars.reduce((sum, car) => sum + car.teljesitmeny, 0) / cars.length).toLocaleString("hu-HU") : 0}</strong><span className="summary-foot">kilométer</span></div>
      </div>

      <div className="section-heading">
        <div>
          <div className="section-kicker">ADATBÁZIS</div>
          <h2>Járművek <span className="subtle-count">{cars.length} rekord</span></h2>
        </div>
        <button className="action-button primary-button add-button" type="button" onClick={() => setIsFormOpen((open) => !open)}>
          <span className="add-symbol">{isFormOpen ? "−" : "+"}</span>{isFormOpen ? "Űrlap bezárása" : "Új autó felvétele"}
        </button>
      </div>

      {isFormOpen && (
        <form className="add-form" onSubmit={handleSubmit}>
          <div className="form-topline">
            <div><h3>Új jármű adatai</h3><p>Töltsd ki a jármű alapadatait a felvételhez.</p></div>
            <span className="required-note">* kötelező mezők</span>
          </div>
          <div className="form-grid">
            <div className="form-field"><label className="field-label" htmlFor="car-brand">Márka *</label><input id="car-brand" className="field-control" required value={draft.marka} onChange={(event) => setDraft({ ...draft, marka: event.target.value })} placeholder="pl. Toyota" /></div>
            <div className="form-field"><label className="field-label" htmlFor="car-model">Típus *</label><input id="car-model" className="field-control" required value={draft.tipus} onChange={(event) => setDraft({ ...draft, tipus: event.target.value })} placeholder="pl. Corolla" /></div>
            <div className="form-field"><label className="field-label" htmlFor="car-mileage">Futásteljesítmény (km) *</label><input id="car-mileage" className="field-control" type="number" min="0" required value={draft.teljesitmeny} onChange={(event) => setDraft({ ...draft, teljesitmeny: Number(event.target.value) })} /></div>
            <div className="form-field"><label className="field-label" htmlFor="car-inspection">Műszaki vizsga dátuma *</label><input id="car-inspection" className="field-control" type="date" required value={draft.muszakiVizsga} onChange={(event) => setDraft({ ...draft, muszakiVizsga: event.target.value })} /></div>
            <div className="form-field"><label className="field-label" htmlFor="car-fuel">Üzemanyag *</label><select id="car-fuel" className="field-control" value={draft.uzemanyag} onChange={(event) => setDraft({ ...draft, uzemanyag: event.target.value })}><option>Benzin</option><option>Dízel</option><option>Hibrid</option><option>Elektromos</option><option>LPG</option></select></div>
            <div className="form-field"><label className="field-label" htmlFor="car-extras">Extrák</label><input id="car-extras" className="field-control" value={extrasInput} onChange={(event) => setExtrasInput(event.target.value)} placeholder="pl. Klíma, tempomat (vesszővel elválasztva)" /></div>
          </div>
          <label className="insurance-check">
            <input className="insurance-input" type="checkbox" checked={draft.biztositasVane} onChange={(event) => setDraft({ ...draft, biztositasVane: event.target.checked })} />
            <span>Érvényes biztosítással rendelkezik</span>
          </label>
          {error && <div className="inline-error form-error">{error}</div>}
          <div className="form-actions"><button className="action-button secondary-button" type="button" onClick={() => setIsFormOpen(false)}>Mégse</button><button className="action-button primary-button" type="submit" disabled={busy}>{busy ? "Mentés…" : "Autó mentése"}</button></div>
        </form>
      )}

      {actionError && <div className="inline-error" role="alert">{actionError}</div>}
      <div className="table-card">
        <CarTable cars={cars} canManage onDelete={onDelete} onToggleInsurance={onToggleInsurance} onAdjustMileage={onAdjustMileage} onActionError={setActionError} />
        <div className="table-footer"><span>{cars.length} jármű megjelenítve</span><span className="permission-note"><span className="permission-dot" /> Admin jogosultság</span></div>
      </div>
    </section>
  );
}

export default AdminPage;
