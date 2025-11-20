// FLOOR INTERFACE
import {Building} from '@/types/building'
export interface Floor {
    id: string;
    building_id: string;
    floor: number;
    floor_prefix: string;
    total_slots: number;
    total_avai_slots: number;
    total_occu_slots: number;
    created_at: Date;
    updated_at: Date;
}

export interface CreateFloor{
    floor: number;
    total_slots: number;
}

export interface ResponseDetailBuilding{
    success: boolean;
    message: string;
    data: {
        building: Building;
        floors: Floor[]
    }
}

export interface ResponseCreateFloor{
    success: boolean;
    message: string;
    data: {
        floors: Floor
    }
}

// SLOTS INTERFACE
export interface Slot{
    id: string;
    building_id: string;
    floor_id: string;
    floor: number;
    slot_number: string;
    status: 'AVAILABLE' | 'OCCUPIED';
}

// Untuk get slots by floor
export interface ResponseSlotsByFloor {
    success: boolean;
    message: string;
    data: {
        building: Building;  // ↑ Context building
        floor: Floor;        // ↑ Context floor  
        slots: Slot[];       // ↑ Slots di floor ini
        summary?: {          // ↑ Optional analytics
            total_slots: number;
            available_slots: number;
            occupied_slots: number;
        }
    }
}

// Untuk update slot status
export interface ResponseUpdateSlot {
    success: boolean;
    message: string;
    data: {
        slot: Slot;          // ↑ Hanya slot yang di-update
    }
}
