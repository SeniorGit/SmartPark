import { SlotsResponse, UpdateSlotStatusRequest, UpdateSlotStatusResponse } from '@/types/building';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const slotService = {
  // Get slots by floor
  async getFloorSlots(buildingId: string, floorNumber: number): Promise<SlotsResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/buildings/${buildingId}/floors/${floorNumber}/slots`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch slots');
    }

    return response.json();
  },

  // Update slot status
  async updateSlotStatus(slotId: string, status: UpdateSlotStatusRequest): Promise<UpdateSlotStatusResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/slots/${slotId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(status),
    });

    if (!response.ok) {
      throw new Error('Failed to update slot status');
    }

    return response.json();
  },
};