// /types/building.ts
export interface Building {
  id: string;
  name: string;
  address: string;
  total_floors: number;
  available_slots: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateBuildingData {
  name: string;
  address: string;
  total_floors: number;
}

export interface UpdateBuildingData {
  name: string;
  address: string;
}