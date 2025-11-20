import { ResponseDetailBuilding,ResponseCreateFloor,ResponseUpdateFloor, CreateFloor, UpdateFloor } from '@/types/floorNslot';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const buildingService = {

  // Get all floors in building
  async getFloorsByBuilding(buildingId: string): Promise<ResponseDetailBuilding> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/admin/buildings/${buildingId}/floors`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // http error response
    if (!response.ok) {
      throw new Error('Failed to fetch floors');
    }

    return response.json();
  },

  // Create Floor
  async createFloor(buildingId: string, data: CreateFloor): Promise<ResponseCreateFloor> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/admin/buildings/${buildingId}/floors`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // http error
    if (!response.ok) {
      throw new Error('Failed to create floor');
    }

    return response.json();
  },

  // Update Floor
  async updateFloor(buildingId: string, data: UpdateFloor): Promise<ResponseUpdateFloor> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/admin/buildings/${buildingId}/floors`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // http error
    if (!response.ok) {
      throw new Error('Failed to create floor');
    }

    return response.json();
  },

  // Delete floor
  async deleteFloor(buildingId: string, floorNumber: number): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/admin/buildings/${buildingId}/floors/${floorNumber}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // http error
    if (!response.ok) {
      throw new Error('Failed to delete floor');
    }
  },
};