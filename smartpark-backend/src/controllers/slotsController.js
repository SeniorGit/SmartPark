const db = require('../lib/utils/database')

exports.getSlotsFloor = async (req, res) => {
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

// update status slot for admin 
exports.updateSlotFloor = async (req, res) => {
    try {
        // get slot id
        const slot_id = req.params.id;

        // check status
        const { status } = req.body;
        if (!status || !['AVAILABLE', 'OCCUPIED'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status must be either AVAILABLE or OCCUPIED'
            });
        }

        // check if slots exist
        const slot = await db('parking_slots')
            .where('id', slot_id)
            .first();
        if (!slot) {
            return res.status(404).json({
                success: false,
                message: 'Parking slot not found'
            });
        }

        // update status
        const [updatedSlot] = await db('parking_slots')
            .where('id', slot_id)
            .update({
                status: status,
                updated_at: new Date()
            })
            .returning(['id', 'slot_number', 'status', 'floor', 'updated_at']);
        
        //send to user 
        return res.status(200).json({
            success: true,
            message: `Slot ${updatedSlot.slot_number} status updated to ${status}`,
        });
    } catch (error) {
        console.error('Update slot status error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error during update slot status'
        });
    }
};