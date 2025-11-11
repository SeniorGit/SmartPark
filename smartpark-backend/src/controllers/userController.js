const db = require('../lib/utils/database')
const {getFloorPrefix} = require('../services/generateParkingSlots')
// get all building
exports.getBuildings = async (req, res) => {
    try {
        const buildings = await db('buildings').select('*');
        
        const buildingsWithAvailability = await Promise.all(
            buildings.map(async (building) => {
                // Hitung total slots
                const totalResult = await db('parking_slots')
                    .where('building_id', building.id)
                    .count('* as total');
                
                // Hitung available slots  
                const availableResult = await db('parking_slots')
                    .where({
                        building_id: building.id,
                        status: 'AVAILABLE'
                    })
                    .count('* as available');
                
                return {
                    id: building.id,
                    name: building.name,
                    address: building.address,
                    total_slots: parseInt(totalResult[0].total),
                    available_slots: parseInt(availableResult[0].available),
                    availability: `${parseInt(availableResult[0].available)}/${parseInt(totalResult[0].total)}`
                };
            })
        );
        
        return res.status(200).json({
            success: true,
            message: 'Getting all data successfully',
            data: {
                buildings: buildingsWithAvailability
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false, 
            message: 'Internal server error during getting all lots data'
        });
    }
};

// get all floor 
exports.getFloors = async (req, res) => {
    try {
        const id = req.params.id;
        
        // check if building exist
        const building = await db('buildings').where('id', id).first();
        if (!building) {
            return res.status(404).json({
                success: false,
                message: 'Building not found'
            });
        }

        // get data floor data in builings
        const floorsData = await db('parking_slots')
            .select('floor')
            .where('building_id', id)
            .groupBy('floor')
            .orderBy('floor');

        const floorWithSlotCount = await Promise.all(
            floorsData.map(async (floor)=>{
                const slotCount = await db('parking_slots')
                        .where({
                            building_id: id,
                            floor: floor.floor
                        })
                        .count('* as total_slots')
                        .first();
                const prefix = getFloorPrefix(floor.floor);
                return {
                    floor: floor.floor,
                    floor_prefix: prefix,
                    total_slots: parseInt(slotCount.total_slots)
                };
            })
        )

        // send data to user
        return res.status(200).json({
            success: true,
            message: `Getting all floor data from ${building.name}`,
            data: {
                building: {
                    id: building.id,
                    name: building.name,
                    address: building.address
                },
                floors: floorWithSlotCount
            }
        });

    } catch (error) {
        console.error('Get floors error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error during get floor buildings'
        });
    }
};

// get all slots
exports.getSlots = async (req, res) => {
        try {
        const building_id = req.params.id;
        const floor_number = parseInt(req.params.floorNumber);

        // check if builing esit
        const building = await db('buildings').where('id', building_id).first();
        if (!building) {
            return res.status(404).json({
                success: false,
                message: 'Building not found'
            });
        }

        // check if floor exist
        const isFloor = await db('parking_slots').where('floor', floor_number);
        if(!isFloor){
            return res.status(404).json({
                success: false,
                message: 'Floor not found'
            })
        }

        // get all slot floor
        const slots = await db('parking_slots')
            .select('id', 'slot_number', 'status', 'updated_at')
            .where({ 
                building_id: building_id, 
                floor: floor_number 
            })
            .orderBy('slot_number');

        // calculate avaibility
        const total_slots = slots.length;
        const available_slots = slots.filter(slot => slot.status === 'AVAILABLE').length;
        const occupied_slots = total_slots - available_slots;
        
        // send data to user
        return res.status(200).json({
            success: true,
            message: `Getting slots for floor ${floor_number} in ${building.name}`,
            data: {
                building: {
                    id: building.id,
                    name: building.name,
                    address: building.address
                },
                floor: floor_number,
                summary: {
                    total_slots: total_slots,
                    available_slots: available_slots,
                    occupied_slots: occupied_slots,
                    availability: `${available_slots}/${total_slots}`
                },
                slots: slots
            }
        });

    } catch (error) {
        console.error('Get floor slots error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error during get floor slots'
        });
    }
};

