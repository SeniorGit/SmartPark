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

exports.update_slot_status = async (req, res) => {
    try {
        const slot_id = req.params.id;
        const { status } = req.body;

        // 1. Validate status
        if (!status || !['AVAILABLE', 'OCCUPIED'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status must be either AVAILABLE or OCCUPIED'
            });
        }

        // 2. Check if slot exists
        const slot = await db('parking_slots')
            .where('id', slot_id)
            .first();

        if (!slot) {
            return res.status(404).json({
                success: false,
                message: 'Parking slot not found'
            });
        }

        // 3. Update slot status
        const [updatedSlot] = await db('parking_slots')
            .where('id', slot_id)
            .update({
                status: status,
                updated_at: new Date()
            })
            .returning(['id', 'slot_number', 'status', 'floor', 'updated_at']);

        // 4. Get building info for response
        const building = await db('buildings')
            .where('id', slot.building_id)
            .first();

        return res.status(200).json({
            success: true,
            message: `Slot ${updatedSlot.slot_number} status updated to ${status}`,
            data: {
                slot: updatedSlot,
                building: {
                    id: building.id,
                    name: building.name
                }
            }
        });

    } catch (error) {
        console.error('Update slot status error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error during update slot status'
        });
    }
};