import { Building, ApiResponse, BuildingResponse, CreateBuilding, UpdateBuilding } from '@/types/building';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const BuildingService = {

  // Get all buildings
  async getAllBuildings(): Promise<Building[]> {
    // get token and send data to backend
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/admin/buildings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // http error
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // get backend response
    const result: ApiResponse<BuildingResponse> = await response.json();
    if (result.success) {
      return result.data?.building || [];
    }
    throw new Error(result.message);
  },

  // Create new building
  async createBuilding(BuildingData: CreateBuilding): Promise<Building> {
    // get token and send data to backend
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/admin/buildings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(BuildingData),
    });

    // http error handling
    if (!response.ok) {
      throw new Error(`HTTP error! status Create: ${response.status}`);
    }

    // get backend response
    const result: ApiResponse<{building: Building}> = await response.json();
    if (result.success) {
      return result.data!.building;
    }
    throw new Error(result.message)
  },

  // Update building
  async updateBuilding(buildingId: string, buildingData: UpdateBuilding): Promise<Building> {
    // get token and send data to backend
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/admin/buildings/${buildingId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildingData),
    });

    // http error handling
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // get backend response
    const result: ApiResponse<{building:Building}> = await response.json();
    if (result.success) {
      return result.data!.building;
    } else {
      throw new Error(result.message || 'Failed to update building');
    }
  },

// Delete
  async deleteBuilding(buildingId: string): Promise<string> {
    // get token and do Delete rows
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/admin/buildings/${buildingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // http error handling
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // get backend response
    const result: ApiResponse<undefined> = await response.json();
    if (result.success) {
      return result.message; 
    } else {
      throw new Error(result.message || 'Failed to delete building');
    }
  }
};