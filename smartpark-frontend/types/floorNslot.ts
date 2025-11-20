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

// create floor
export interface CreateFloor{
    floor: number;
    total_slots: number;
}

// response get builing
export interface ResponseDetailBuilding{
    success: boolean;
    message: string;
    data: {
        building: Building;
        floors: Floor[]
    }
}

// response create floor
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

// update slot
export interface SlotUpdate{
    status: 'AVAILABLE' | 'OCCUPIED';
}

// Untuk get slots by floor
export interface ResponseGetSlots {
    success: boolean;
    message: string;
    data: {
        building: Building;  
        floor: Floor;        
        slots: Slot[];       
        summary?: {         
            total_slots: number;
            available_slots: number;
            occupied_slots: number;
        }
    }
}

// Update slots
export interface ResponseUpdateSlot {
    success: boolean;
    message: string;
    data: {
        slot: Slot;         
    }
}
