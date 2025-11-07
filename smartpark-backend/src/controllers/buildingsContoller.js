const db = require('../lib/utils/database')
const {generateParkingSlots} = require('../services/generateParkingSlots')
const {createdLotsAdmins, updateLotsAdmins} = require('../lib/validator/adminLotsForms')

exports.create_lots = async (req, res) => {
    try{
        const {error, value} = createdLotsAdmins.body.validate(req.body)
        if(error){
            return res.status(400).json({
                success: false,
                message: error.details.map(err => err.message)
            })
        }
        const {name, address, total_floors} = value
        const [createLots] = await db('buildings').insert({
            name: name,
            address: address,
            total_floors: total_floors
        }).returning(['id', 'name', 'address', 'total_floors', 'created_at'])

        const slotCount = await generateParkingSlots(createLots.id, createLots.total_floors);
        return res.status(201).json({
            success: true,
            message: `Parking lots at ${createLots.name} successful created with ${slotCount} `,
            data: {
                user: createLots
            }
        })
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error during creating lots'
        })
    }
}


exports.all_lots_data = async (req, res) => {
    try{
        const lots = await db('buildings').select('*');
        const slots_avaibility = await Promise.all(
            lots.map(async (lot) =>{
                const total_slots = await db('parkings_slots')
                    .where('building_id', lot.id)
                    .count(' * as total');
                
                const availableResult = await db('parking_slot')
                .where({
                    building_id: lot.id,
                    status: 'AVAILABLE'
                })
                .count('* as available');

                return {
                    id: lot.id,
                    name: lot.name,
                    address: lot.address,
                    total_floors: parseInt(total_slots[0].total),
                    available_slots: parseInt(availableResult[0].available)
                };
            })
        );
        
        return res.status(200).json({
            success: true,
            message: 'Getting all data successfuly',
            data: slots_avaibility
        })
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success: false, 
            message: 'Internal server error during getting all lots data'
        })
    }
}

exports.update_lots = async (req, res) => {
    try{
        const id = req.params.id;
        const {error, value} = updateLotsAdmins.body.validate(req.body)
        if(error){
            return res.status(400).json({
                success: false,
                message: error.details.map(err => err.message)
            })
        }
        const {name, address} = value

        const isID = await db('buildings').where('id', id).first();
        if(!isID){
            return res.status(404).json({
                success: false, 
                message: 'Lots not found'
            })
        }

        const updateLots = await db('buildings')
        .where('id', id)
        .update({
            name: name,
            address: address,
            updated_at: new Date()
        })
        .returning(['id', 'name', 'address', 'updated_at']);

        return res.status(200).json({
            success: true,
            message: `Updated at ${updateLots.name} successfuly`
        })
        

    }catch(error){
        console.error(error);
        return res.status(500).json({
            success: false, 
            message: 'Internal server error during updating lots'
        })
    }
}

exports.delete_lots = async (req, res) => {
    try{
        const id = req.params.id;
        const isID = await db('buildings').where('id', id).first();
        if(!isID){
            return res.status(404).json({
                success: false, 
                message: 'Lots not found'
            })
        }
        await db('buildings').where('id', id).del()

        return res.status(201).json({
            success: true,
            message: `lots ${building.name} deleted successfully`
        })
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success: false, 
            message: 'Internal server error during deleting lots'
        })
    }
}