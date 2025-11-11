const db = require('../lib/utils/database')
const {validationResult} = require('express-validator')

// show all data park buildings
exports.showAllParkingLot = async (req, res) => {
    try{
        // get all building data and send to user
        const lots = await db('buildings').select('id', 'name', 'address', 'total_floors');
        return res.status(200).json({
            success: true,
            message: 'Getting all data successfuly',
            data: {
                user: lots
            }
        })
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success: false, 
            message: 'Internal server error during getting all lots data'
        })
    }
}

// create parking building
exports.createParkingLots = async (req, res) => {
    try{
        // validation user input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array().map(error => ({
                field: error.path,
                message: error.msg
                }))
            });
        }

        // get input and creating new buildings data
        const {name, address, total_floors} = req.body
        const [createLots] = await db('buildings').insert({
            name: name,
            address: address,
            total_floors: total_floors
        }).returning(['id', 'name', 'address', 'total_floors', 'created_at'])

        // sending data to user
        return res.status(201).json({
            success: true,
            message: `Parking lots at ${createLots.name} successful created`,
            data: createLots
        })
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error during creating lots'
        })
    }
}

// update building
exports.updateParkingLots = async (req, res) => {
    try{
        // validation
        const id = req.params.id;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array().map(error => ({
                field: error.path,
                message: error.msg
                }))
            });
        }
        // get name and address
        const {name, address, total_floors} = req.body

        // get Id and check it
        const isID = await db('buildings').where('id', id).first();
        if(!isID){
            return res.status(404).json({
                success: false, 
                message: 'Lots not found'
            })
        }

        // update builings data
        const updateLots = await db('buildings')
        .where('id', id)
        .update({
            name: name,
            address: address,
            total_floors: total_floors,
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

// delete building
exports.deleteParkingLots = async (req, res) => {
    try{
        // get id and check if Id exist
        const id = req.params.id;
        const isID = await db('buildings').where('id', id).first();
        if(!isID){
            return res.status(404).json({
                success: false, 
                message: 'Lots not found'
            })
        }

        // delete builings rows
        await db('buildings').where('id', id).del()
        return res.status(201).json({
            success: true,
            message: `lots ${isID.name} deleted successfully`
        })
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success: false, 
            message: 'Internal server error during deleting lots'
        })
    }
}