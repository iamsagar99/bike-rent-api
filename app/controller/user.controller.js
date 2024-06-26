const AuthService = require('../services/auth.service.js');  
const prisma = require('../../config/pg.config.js');
const bcrypt = require('bcrypt');
class UserController {

    constructor(){
        this.auth_svc = new AuthService();
    }
    
    addUser = async(req, res, next) =>{
        const data = req.body;

        const validationErrors = this.auth_svc.registerValidate(data);

        if (validationErrors) {
            next({
                status: 400,
                msg: validation
            }) 
        }

        try {
            const finduser = await prisma.user.findUnique({
                where:{
                    email:data.email
                }
            });

            if(finduser){
                return res.json({
                    status:400,
                    msg:"User already exists"
                });
            }


            const salt = await bcrypt.genSalt(10);
            data.password = await bcrypt.hash(password, salt);
            console.log(data)
            const user = await prisma.user.create({
                data
            });

            res.json({
                result: user, // Return the created user object
                msg: 'User registered successfully',
                status: true,
            });
        } catch (error) {
            console.error('Error creating user:', error);
            next({
                status: 500,
                msg: 'Internal Server Error'
            }); 
        }
    }

    updateUserById = async(req,res,next)=>{
        const { name, email, password, role, phone, user_type, locationId, status} = req.body;
        const { id } = req.params;


        if (!email) {
            next({
                status: 400,
                msg: "Email is required."
            }) 
        }

        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: parseInt(id),
                },
            });

            if(!user){
                return res.json({
                    status: 404,
                    msg: 'User not found',
                });
            }
            // Checking if user wants to update passowrd
            if(password?.length >0){
                const salt = await bcrypt.genSalt(10);
                password = await bcrypt.hash(password, salt);
            }
            
            const ack = await prisma.user.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    name,
                    email,
                    password, 
                    role,
                    phone,
                    user_type,
                    locationId,
                    status
                },
            });

            res.json({
                result: ack,
                msg: 'User updated successfully',
                status: true,
            });
        } catch (error) {
            console.error('Error updating user:', error);
            next({
                status: 500,
                msg: 'Internal Server Error'
            }); 
        }
    }


    deleteUserById = async(req,res,next)=>{
        const { id } = req.params;

        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: parseInt(id),
                },
            });

            if(!user){
                return res.json({
                    status: 404,
                    msg: 'User not found',
                });
            }
            
            const ack = await prisma.user.delete({
                where: {
                    id: parseInt(id),
                },
            });

            res.json({
                result: ack,
                msg: 'User deleted successfully',
                status: true,
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            next({
                status: 500,
                msg: 'Internal Server Error'
            }); 
        }
    }

    getAllUsers = async(req,res,next)=>{
        try {
            const users = await prisma.user.findMany();
            res.json({
                result: users,
                msg: 'Users fetched successfully',
                status: true,
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            next({
                status: 500,
                msg: 'Internal Server Error'
            }); 
        }
    }

    getUserById = async(req,res,next)=>{
        const { id } = req.params;
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: parseInt(id),
                },
            });

            if(!user){
                return res.json({
                    status: 404,
                    msg: 'User not found',
                });
            }

            res.json({
                result: user,
                msg: 'User fetched successfully',
                status: true,
            });
        } catch (error) {
            console.error('Error fetching user:', error);
            next({
                status: 500,
                msg: 'Internal Server Error'
            }); 
        }
    }
}

module.exports = UserController;
