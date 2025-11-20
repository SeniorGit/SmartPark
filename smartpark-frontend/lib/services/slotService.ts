import { ResponseGetSlots, SlotUpdate, ResponseUpdateSlot } from '@/types/floorNslot';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const slotService = {
  // Get slots by floor
  async getFloorSlots(buildingId: string, floorNumber: number): Promise<ResponseGetSlots> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/admin/buildings/${buildingId}/floors/${floorNumber}/slots`, {
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
  async updateSlotStatus(buildingId: string, floorNumber: number,slotId: string, status: SlotUpdate): Promise<ResponseUpdateSlot> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/admin/buildings/${buildingId}/floors/${floorNumber}/slots/${slotId}`, {
      
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