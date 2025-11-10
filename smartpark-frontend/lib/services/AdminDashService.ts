import { Building, CreateBuildingData, UpdateBuildingData } from '@/types/adminDash';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const BuildingService = {
  // Get all buildings
  async getAllBuildings(): Promise<Building[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/buildings`, {
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
    
    // Sesuaikan dengan response format dari backend Anda
    if (result.success && result.data) {
      return result.data;
    } else if (Array.isArray(result)) {
      return result;
    } else {
      throw new Error('Invalid response format');
    }
  },

  // Create new building
  async createBuilding(buildingData: CreateBuildingData): Promise<Building> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/buildings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildingData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Failed to create building');
    }

    const result = await response.json();
    
    if (result.success && result.data) {
      return result.data;
    } else if (result.success && Array.isArray(result.data) && result.data.length > 0) {
      // Handle returning array format
      return result.data[0];
    } else {
      throw new Error('Invalid response format after creation');
    }
  },

  // Update building
  async updateBuilding(buildingId: string, buildingData: UpdateBuildingData): Promise<Building> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/buildings/${buildingId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildingData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Failed to update building');
    }

    const result = await response.json();
    
    if (result.success) {
      // Jika backend tidak return updated data, kita return data yang di-update
      return {
        id: buildingId,
        ...buildingData,
        // Field lainnya akan di-handle oleh optimistic update di component
      } as Building;
    } else {
      throw new Error(result.message || 'Failed to update building');
    }
  },

  // Delete building
  async deleteBuilding(buildingId: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/buildings/${buildingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Failed to delete building');
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to delete building');
    }
  },
};