const db = require('../lib/utils/database')

// Generate floor with slots
const generateSlotsFloor = async (building_id, floorNum, total_slots=10)=>{
    const prefix = getFloorPrefix(floorNum)
    const slots = [];

    // looping for creating slots
    for(let slotNum = 1; slotNum <= total_slots; slotNum++){
        slots.push({
            building_id: building_id,
            floor: floorNum, 
            slot_number: `${prefix}-${slotNum.toString().padStart(2, '0')}`,
            status: 'AVAILABLE',
            created_at: new Date(),
        })
    }
    await db('parking_slots').insert(slots);
    return prefix;
}

// update floor slots
const updateSlotsFloor = async (building_id, floorNum, total_slots=10)=>{
    const prefix = getFloorPrefix(floorNum);
    
    // delete floor
    await db('parking_slots')
        .where({ 
            building_id: building_id, 
            floor: floorNum 
        })
        .delete();
    
    // create new floor
    const slots = [];
    for(let slotNum = 1; slotNum <= total_slots; slotNum++){
        slots.push({
            building_id: building_id,
            floor: floorNum,
            slot_number: `${prefix}-${slotNum.toString().padStart(2, '0')}`,
            status: 'AVAILABLE',
            created_at: new Date(),
        })
    }
    
    await db('parking_slots').insert(slots);
    return prefix;
}

// change floor to code B, G, or L 
const getFloorPrefix = (floor) => {
    if (floor < 0) return `B${Math.abs(floor)}`; 
    if (floor === 1) return 'G';               
    return `L${floor}`;                        
};

module.exports = {generateSlotsFloor, updateSlotsFloor, getFloorPrefix};