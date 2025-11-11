const {hashPasword, comparePassword} = require('../lib/utils/password')
const {generateToken} = require('../lib/utils/jwtUtils')
const db = require('../lib/utils/database')
const {validationResult} = require('express-validator')

// register Logic
exports.register = async (req, res)=>{
    try{
        // validation input
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

        // get input and check if users is exist
        const {first_name, last_name, phone_number, email, password} = req.body
        const existingUser  = await db('users').where('email', email).first();
        if(existingUser){
            return res.status(400).json({
                success:false,
                message: 'Email already registered'
            })
        }

        // hasing password and sending data to DB
        const hashingPassword = await hashPasword(password);
        const [newUser] = await db('users').insert({
            email, 
            password: hashingPassword,
            first_name: first_name,
            last_name: last_name,
            phone_number: phone_number
        }).returning(['id', 'email', 'first_name', 'last_name', 'phone_number', 'created_at'])
        
        // sending data to user 
        return res.status(201).json({
            success:true,
            message: 'User registration successful', 
            data: {
                user: newUser 
            }
        })
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error during registration'
        })
    }
}

// login logic
exports.login = async (req, res) => {
    try{
        // validation for login input
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
        
        // get input and check if users is exist
        const {email, password} = req.body
        const user = await db('users').where('email', email).first();
        if(!user){
            return res.status(401).json({
                success: false, 
                message: 'Invalid email or password'
            })
        }

        // comparing password input user and db
        const comparingPass = await comparePassword(password, user.password);
        if(!comparingPass){
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        // generate token for auth
        const userRole = user.role;
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: userRole
        },)

        // sending data to user
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    first_name: user.first_name,
                    role: userRole
                },
                token: token,
                redirectTo: userRole === 'ADMIN' ? '/admin' : '/dashboard'
            },
        })
    }catch(error){
        console.error('Login error:', error); 
        return res.status(500).json({
            success: false,
            message: 'Internal server error during login' 
        });
    }
}