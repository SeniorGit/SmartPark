import { Building } from '@/types/userDash';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const UserService = {
  // Get all buildings for user view
  async getAllBuildings(): Promise<Building[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/user/buildings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch buildings');
    }

    const result = await response.json();
    
    // Handle berbagai format response
    if (result.success && Array.isArray(result.data)) {
      return result.data;
    } else if (Array.isArray(result)) {
      return result;
    } else if (result.success && result.buildings) {
      return result.buildings;
    } else {
      throw new Error('Unexpected response format');
    }
  },

  async getBuildingDetails(buildingId: string): Promise<Building> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/user/buildings/${buildingId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch building details');
    }

    const result = await response.json();
    
    if (result.success && result.data) {
      return result;
    } else {
      throw new Error('Invalid response format');
    }
  },
  
  async getFloorSlots(buildingId: string, floorNumber: number): Promise<Building> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/user/buildings/${buildingId}/floors/${floorNumber}/slots`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch slots');
    }

    const result = await response.json();
    
    if (result.success && result.data) {
      return result;
    } else {
      throw new Error('Invalid response format');
    }
  },
};