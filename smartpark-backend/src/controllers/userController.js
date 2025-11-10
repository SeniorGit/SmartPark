const db = require('../lib/utils/database')

exports.get_floor_slots = async (req, res) => {
    try {
        const building_id = req.params.id;
        const floor_number = parseInt(req.params.floorNumber);

        // 1. Check if building exists
        const building = await db('buildings').where('id', building_id).first();
        if (!building) {
            return res.status(404).json({
                success: false,
                message: 'Building not found'
            });
        }

        // 2. Get all slots for this floor
        const slots = await db('parking_slots')
            .select('id', 'slot_number', 'status', 'created_at', 'updated_at')
            .where({ 
                building_id: building_id, 
                floor: floor_number 
            })
            .orderBy('slot_number');

        // 3. Calculate availability
        const total_slots = slots.length;
        const available_slots = slots.filter(slot => slot.status === 'AVAILABLE').length;
        const occupied_slots = total_slots - available_slots;

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

exports.get_floor_buildings = async (req, res) => {
    try {
        const id = req.params.id;
        
        // 1. Get building info
        const building = await db('buildings').where('id', id).first();
        if (!building) {
            return res.status(404).json({
                success: false,
                message: 'Building not found'
            });
        }

        // 2. Get distinct floors dengan availability data (SINGLE QUERY - lebih efficient)
        const floorsData = await db('parking_slots')
            .select('floor')
            .count('* as total_slots')
            .sum(db.raw("CASE WHEN status = 'AVAILABLE' THEN 1 ELSE 0 END as available_slots"))
            .where('building_id', id)
            .groupBy('floor')
            .orderBy('floor');

        // 3. Format response
        const floors = floorsData.map(floor => ({
            floor: floor.floor,
            total_slots: parseInt(floor.total_slots),
            available_slots: parseInt(floor.available_slots) || 0,
            availability: `${parseInt(floor.available_slots) || 0}/${parseInt(floor.total_slots)}`
        }));

        return res.status(200).json({
            success: true,
            message: `Getting all floor data from ${building.name}`,
            data: {
                building: {
                    id: building.id,
                    name: building.name,
                    address: building.address
                },
                floors: floors
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

exports.all_lots_data = async (req, res) => {
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
            data: buildingsWithAvailability
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false, 
            message: 'Internal server error during getting all lots data'
        });
    }
};