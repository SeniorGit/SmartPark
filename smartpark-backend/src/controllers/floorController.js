const db = require('../lib/utils/database');
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

exports.create_floor_buildings = async (req, res) => {
    try {
        const building_id = req.params.id;
        const { floor_number, slots_count = 20 } = req.body;

        // 1. Validasi input
        if (!floor_number || !slots_count) {
            return res.status(400).json({
                success: false,
                message: 'Floor number and slots count are required'
            });
        }

        // 2. Check if building exists
        const building = await db('buildings').where('id', building_id).first();
        if (!building) {
            return res.status(404).json({
                success: false,
                message: 'Building not found'
            });
        }

        // 3. Check if floor already exists
        const existingFloor = await db('parking_slots')
            .where({ building_id, floor: floor_number })
            .first();
            
        if (existingFloor) {
            return res.status(400).json({
                success: false,
                message: `Floor ${floor_number} already exists in this building`
            });
        }

        // 4. Generate slot prefix berdasarkan floor number
        const getFloorPrefix = (floor) => {
            if (floor < 0) return `B${Math.abs(floor)}`; // Basement: B1, B2
            if (floor === 1) return 'G';               // Ground floor: G
            return `L${floor}`;                        // Upper floors: L2, L3
        };

        const prefix = getFloorPrefix(floor_number);
        const slotsToInsert = [];

        // 5. Generate parking slots
        for (let i = 1; i <= slots_count; i++) {
            slotsToInsert.push({
                building_id: building_id,
                floor: floor_number,
                slot_number: `${prefix}-${i.toString().padStart(2, '0')}`,
                status: 'AVAILABLE',
                created_at: new Date(),
                updated_at: new Date()
            });
        }

        // 6. Bulk insert slots
        await db('parking_slots').insert(slotsToInsert);

        return res.status(201).json({
            success: true,
            message: `Floor ${floor_number} created successfully with ${slots_count} slots`,
            data: {
                building_id: building_id,
                floor_number: floor_number,
                slots_created: slots_count,
                slot_prefix: prefix
            }
        });

    } catch (error) {
        console.error('Create floor error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error during create floor'
        });
    }
};

exports.delete_floor_buildings = async (req, res) => {
    try {
        const building_id = req.params.id;
        const floor_number = req.params.floorNumber;

        // 1. Check if building exists
        const building = await db('buildings').where('id', building_id).first();
        if (!building) {
            return res.status(404).json({
                success: false,
                message: 'Building not found'
            });
        }

        // 2. Check if floor exists and get slots count
        const floorSlots = await db('parking_slots')
            .where({ 
                building_id: building_id, 
                floor: floor_number 
            })
            .count('* as slots_count')
            .first();

        if (!floorSlots || parseInt(floorSlots.slots_count) === 0) {
            return res.status(404).json({
                success: false,
                message: `Floor ${floor_number} not found in this building`
            });
        }

        // 3. Delete all slots in this floor
        const deletedCount = await db('parking_slots')
            .where({ 
                building_id: building_id, 
                floor: floor_number 
            })
            .del();

        return res.status(200).json({
            success: true,
            message: `Floor ${floor_number} deleted successfully (${deletedCount} slots removed)`,
            data: {
                building_id: building_id,
                floor_number: floor_number,
                slots_deleted: deletedCount
            }
        });

    } catch (error) {
        console.error('Delete floor error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error during delete floor'
        });
    }
};