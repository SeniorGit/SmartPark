export interface Building {
  id: string;
  name: string;
  address: string;
}

export interface Floor {
  floor: number;
  total_slots: number;
  available_slots: number;
  availability: string;
}

export interface BuildingDetailsResponse {
  success: boolean;
  message: string;
  data: {
    building: Building;
    floors: Floor[];
  };
}

export interface CreateFloorRequest {
  floor_number: number;
  slots_count: number;
  prefix?: string;
}

export interface CreateFloorResponse {
  success: boolean;
  message: string;
  data: {
    building_id: string;
    floor_number: number;
    slots_created: number;
    slot_prefix: string;
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

export interface SlotsResponse {
  success: boolean;
  message: string;
  data: {
    building: Building;
    floor: number;
    summary: {
      total_slots: number;
      available_slots: number;
      occupied_slots: number;
      availability: string;
    };
    slots: Slot[];
  };
}

export interface UpdateSlotStatusRequest {
  status: 'AVAILABLE' | 'OCCUPIED';
}

export interface UpdateSlotStatusResponse {
  success: boolean;
  message: string;
  data: {
    slot: Slot;
    building: {
      id: string;
      name: string;
    };
  };
}