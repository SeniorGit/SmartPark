export interface Building {
  id: string;
  name: string;
  address:  string;
  total_slots: number;
  created_at: Date;
  updated_at: Date;
}

export interface ApiResponse<T>{
  success: boolean;
  message: string;
  data?: T
}

export interface BuildingResponse {
  building: Building[]
}

export interface CreateBuilding{
  name: string;
  address: string;
}

export interface UpdateBuilding{
  name?: string;
  address?: string;
}
