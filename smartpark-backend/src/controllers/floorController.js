const db = require('../lib/utils/database');
const {validationResult} = require('express-validator')
const {generateSlotsFloor, updateSlotsFloor, getFloorPrefix} = require('../services/generateParkingSlots')

// show all floor in buildings
exports.getAllFloors = async (req, res) => {
    try {
        // check if id exist
        const id = req.params.id;
        const building = await db('buildings').where('id', id).first();
        if (!building) {
            return res.status(404).json({
                success: false,
                message: 'Building not found'
            });
        }

        // take floor column
        const floorsData = await db('parking_slots')
            .select('floor')
            .where('building_id', id)
            .groupBy('floor')
            .orderBy('floor');

        // start counting total slots per floor
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
                const availSlot = await db('parking_slots')
                        .where({building_id: id,
                            floor: floor.floor,
                            status: 'AVAILABLE'
                        })
                        .count('* as totalAvailSlots')
                        .first();
                const occupSlot = parseInt(slotCount.total_slots) - parseInt(availSlot.totalAvailSlots);
                return {
                    floor: floor.floor,
                    floor_prefix: prefix,
                    total_slots: parseInt(slotCount.total_slots),
                    total_avai_slots: parseInt(availSlot.totalAvailSlots),
                    total_occu_slots: occupSlot
                };
            })
        )

        // sending response data
        return res.status(200).json({
            success: true,
            message: `Getting all floor data from ${building.name}`,
            data: {
                building: {
                    id: building.id,
                    name: building.name,
                    address: building.address,
                },
                floors: floorWithSlotCount,
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

exports.createFloors = async (req, res) => {
    try {
        // validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        
        // getting builings id and check if exist
        const building_id = req.params.id;
        const { floor, slots_count } = req.body;
        const building = await db('buildings').where('id', building_id).first();
        if (!building) {
            return res.status(404).json({
                success: false,
                message: 'Building not found'
            });
        }

        // check if floor is exist
        const existingFloor = await db('parking_slots')
            .where({ building_id, floor: floor })
            .first();
        if (existingFloor) {
            return res.status(400).json({
                success: false,
                message: `Floor ${floor} already exists in this building`
            });
        }

        // generate slots 
        const [prefix] = await generateSlotsFloor(building_id, floor, slots_count);
        
        // send to user
        return res.status(201).json({
            success: true,
            message: `Floor ${floor} (${prefix}) created successfully with ${slots_count} slots`,
            data: {
                floors: {
                    building_id: building_id,
                    floor: floor,
                    floor_prefix: prefix,
                    slots_created: slots_count,
                    created_at: new Date()
                }
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

exports.updateFloors = async (req, res) => {
    try {
        // validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        
        // get id and check if buildings exist
        const building_id = req.params.id;
        const { floor, slots_count } = req.body;        
        const building = await db('buildings').where('id', building_id).first();
        if (!building) {
            return res.status(404).json({
                success: false,
                message: 'Building not found'
            });
        }

        // Check if floor exists
        const existingFloor = await db('parking_slots')
            .where({ building_id, floor: floor })
            .first();
        if (!existingFloor) {
            return res.status(404).json({
                success: false,
                message: `Floor ${floor} not found in this building`
            });
        }

        // update Parkings Slot
        const prefix = await updateSlotsFloor(building_id, floor, slots_count);
        
        const total_slot = await db('parking_slots')
        .where({building_id, floor: floor})
        .select('slot_number')

        // send to user
        return res.status(200).json({
            success: true,
            message: `Floor ${floor} (${prefix}) updated successfully with ${slots_count} slots`,
            data: {
                floors:{

                }
            }
        });

    } catch (error) {
        console.error('Update floor error:', error);
        return res.status(500).json({
            success: false,
            message: `Internal server error during update floor: ${error.message}`
        });
    }
};

exports.deleteFloor = async (req, res) => {
    try {
        const building_id = req.params.id;
        const floor_number = req.params.floorNumber;

        // check if exist
        const building = await db('buildings').where('id', building_id).first();
        if (!building) {
            return res.status(404).json({
                success: false,
                message: 'Building not found'
            });
        }

        // check if floor exist
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

        // delete floor
        const deletedCount = await db('parking_slots')
            .where({ 
                building_id: building_id, 
                floor: floor_number 
            })
            .del();

        return res.status(200).json({
            success: true,
            message: `Floor ${floor_number} deleted successfully (${deletedCount} slots removed)`,
        });

    } catch (error) {
        console.error('Delete floor error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error during delete floor'
        });
    }
};