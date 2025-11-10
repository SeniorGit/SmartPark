import { BuildingDetailsResponse, CreateFloorRequest, CreateFloorResponse } from '@/types/building';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const buildingService = {
  // Get all floors in building
  async getFloorsByBuilding(buildingId: string): Promise<BuildingDetailsResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/buildings/${buildingId}/floors`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch floors');
    }

    return response.json();
  },

  // Create new floor
  async createFloor(buildingId: string, data: CreateFloorRequest): Promise<CreateFloorResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/buildings/${buildingId}/floors`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create floor');
    }

    return response.json();
  },

  // Delete floor
  async deleteFloor(buildingId: string, floorNumber: number): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/buildings/${buildingId}/floors/${floorNumber}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete floor');
    }
  },
};