export interface Car {
  id: string | number;
  marka: string;
  tipus: string;
  teljesitmeny: number;
  muszakiVizsga: string;
  biztositasVane: boolean;
  uzemanyag: string;
  extrak: string[];
}

export type CarDraft = Omit<Car, "id">;
