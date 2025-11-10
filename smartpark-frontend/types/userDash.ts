export interface Building {
  id: string;
  name: string;
  address: string;
  total_slots: number;
  available_slots: number;
  availability: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

// Tambahkan interface berikut:

export interface Floor {
  floor: number;
  total_slots: number;
  available_slots: number;
  availability: string;
}

export interface BuildingDetails {
  id: string;
  name: string;
  address: string;
}

export interface BuildingDetailsResponse {
  success: boolean;
  message: string;
  data: {
    building: BuildingDetails;
    floors: Floor[];
  };
}

export interface Slot {
  id: string;
  slot_number: string;
  status: 'AVAILABLE' | 'OCCUPIED';
  floor: number;
  building_id: string;
  created_at: string;
  updated_at: string;
}

export interface SlotsSummary {
  total_slots: number;
  available_slots: number;
  occupied_slots: number;
  availability: string;
}

export interface SlotsResponse {
  success: boolean;
  message: string;
  data: {
    building: BuildingDetails;
    floor: number;
    summary: SlotsSummary;
    slots: Slot[];
  };
}