import type { Car, CarDraft } from "../assets/type/types";

const CARS_URL = "http://localhost:3000/cars";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`A szerver hibát jelzett (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

export const carApi = {
  list: () => request<Car[]>(CARS_URL),

  create: (car: CarDraft) => request<Car>(CARS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(car),
  }),

  update: (id: Car["id"], changes: Partial<Car>) =>
    request<Car>(`${CARS_URL}/${encodeURIComponent(String(id))}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    }),

  async remove(id: Car["id"]) {
    const response = await fetch(`${CARS_URL}/${encodeURIComponent(String(id))}`, { method: "DELETE" });
    if (!response.ok) {
      throw new Error(`A szerver hibát jelzett (${response.status}).`);
    }
  },
};
