const {registerValidator} = require('../lib/validator/registerValidator')
const {loginValidator} = require('../lib/validator/loginValidator')
const {hashPasword, comparePassword} = require('../lib/utils/password')
const {generateToken} = require('../lib/utils/jwtUtils')
const db = require('../lib/utils/database')

exports.register = async (req, res)=>{
    try{
        const { error, value } = registerValidator.body.validate(req.body);
        if(error){
            return res.status(400).json({
                success: false,
                message: error.details.map(err => err.message)
            })
        }
        const {first_name, last_name, phone_number, email, password} = value

        const existingUser  = await db('users').where('email', email).first();
        if(existingUser){
            return res.status(400).json({
                success:false,
                message: 'Email already registered'
            })
        }

        const hashingPassword = await hashPasword(password);

        const [newUser] = await db('users').insert({
            email, 
            password: hashingPassword,
            first_name: first_name,
            last_name: last_name,
            phone_number: phone_number
        }).returning(['id', 'email', 'first_name', 'last_name', 'phone_number', 'created_at'])

        res.status(201).json({
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

exports.login = async (req, res) => {
    try{
        const {error, value} = loginValidator.body.validate(req.body);

        if(error){
            return res.status(400).json({
                success: false,
                message: error.details.map(err => err.message)
            })
        }
        
        const {email, password} = value
        const user = await db('users').where('email', email).first();
        if(!user){
            return res.status(401).json({
                success: false, 
                message: 'Invalid email or password'
            })
        }

        const comparingPass = await comparePassword(password, user.password);
        if(!comparingPass){
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        const userRole = user.role;
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: userRole
        },)

        res.status(200).json({
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