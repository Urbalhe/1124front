import type { Car } from "../../assets/type/types";

interface CarTableProps {
  cars: Car[];
  canManage: boolean;
  onDelete?: (id: Car["id"]) => Promise<void>;
  onToggleInsurance?: (car: Car) => Promise<void>;
  onAdjustMileage?: (car: Car, amount: number) => Promise<void>;
  onActionError: (message: string) => void;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("hu-HU").format(new Date(`${value}T00:00:00`));
}

function CarTable({
  cars,
  canManage,
  onDelete,
  onToggleInsurance,
  onAdjustMileage,
  onActionError,
}: CarTableProps) {
  async function performAction(action: () => Promise<void>) {
    try {
      await action();
      onActionError("");
    } catch (cause) {
      onActionError(cause instanceof Error ? cause.message : "A művelet nem sikerült.");
    }
  }

  if (cars.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">⌕</div>
        <h3>Még nincs megjeleníthető autó</h3>
        <p>Az adminisztrátor új járművet adhat hozzá a nyilvántartáshoz.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="car-table">
        <thead>
          <tr>
            <th>JÁRMŰ</th>
            <th>FUTÁSTELJESÍTMÉNY</th>
            <th>MŰSZAKI VIZSGA</th>
            <th>ÜZEMANYAG</th>
            <th>BIZTOSÍTÁS</th>
            <th>EXTRÁK</th>
            {canManage && <th className="actions-cell">MŰVELETEK</th>}
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.id}>
              <td>
                <div className="car-identity">
                  <span className="car-avatar">{car.marka.charAt(0).toUpperCase()}</span>
                  <span>
                    <span className="car-brand">{car.marka}</span>
                    <span className="car-model">{car.tipus}</span>
                  </span>
                </div>
              </td>
              <td>
                {canManage && onAdjustMileage ? (
                  <div className="number-control">
                    <button className="step-button" type="button" aria-label={`${car.marka} futásteljesítményének csökkentése`} onClick={() => void performAction(() => onAdjustMileage(car, -1000))}>−</button>
                    <span className="mileage-value">{car.teljesitmeny.toLocaleString("hu-HU")} <small>km</small></span>
                    <button className="step-button" type="button" aria-label={`${car.marka} futásteljesítményének növelése`} onClick={() => void performAction(() => onAdjustMileage(car, 1000))}>+</button>
                  </div>
                ) : (
                  <span className="mileage-value">{car.teljesitmeny.toLocaleString("hu-HU")} <small>km</small></span>
                )}
              </td>
              <td><span className="date-value">{formatDate(car.muszakiVizsga)}</span></td>
              <td><span className="fuel-pill">{car.uzemanyag}</span></td>
              <td>
                {canManage && onToggleInsurance ? (
                  <button
                    className={`insurance-toggle ${car.biztositasVane ? "is-active" : ""}`}
                    type="button"
                    aria-label={`${car.marka}: biztosítás ${car.biztositasVane ? "kikapcsolása" : "bekapcsolása"}`}
                    aria-pressed={car.biztositasVane}
                    onClick={() => void performAction(() => onToggleInsurance(car))}
                  >
                    <span className="toggle-track"><span /></span>
                    <span>{car.biztositasVane ? "Aktív" : "Inaktív"}</span>
                  </button>
                ) : (
                  <span className={`status-badge ${car.biztositasVane ? "status-active" : "status-inactive"}`}>
                    <span className="status-dot" />{car.biztositasVane ? "Aktív" : "Inaktív"}
                  </span>
                )}
              </td>
              <td>
                <div className="extras-list">
                  {car.extrak.map((extra) => <span className="extra-tag" key={extra}>{extra}</span>)}
                </div>
              </td>
              {canManage && onDelete && (
                <td className="actions-cell">
                  <button className="action-button danger-button delete-button" type="button" onClick={() => void performAction(() => onDelete(car.id))}>
                    Törlés
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CarTable;
