const db = require('../lib/utils/database')

const generateParkingSlots = async (building_id, total_floors, slots_per_floor=20)=>{
    const slots = [];

    for(let floor = 1; floor<= total_floors; floor++){
        for(let slot = 1; slot <= slots_per_floor; slot++){
            slots.push({
                building_id: building_id,
                floor: floor,
                slot_number: `${slot}-${slot.toString().padStart(3, '0')}`,
                status: 'AVAILABLE'
            })

        }
    }

    await db('parking_slots').insert(slots);
    return slots.length
}

module.exports = {generateParkingSlots};