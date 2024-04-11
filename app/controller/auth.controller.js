const AuthService = require('../services/auth.service.js');
const prisma = require('../../config/pg.config.js');
const bcrypt = require('bcrypt');


class AuthController {

    constructor() {
        this.auth_svc = new AuthService();
    }


    register = async (req, res, next) => {
        const { name, email, password, role, phone, user_type,locationId,status } = req.body;

        const validationErrors = this.auth_svc.registerValidate({
            name,
            email,
            password,
            phone,
            locationId
        });

        if (validationErrors) {
            next({
                status: 400,
                msg: validationErrors
            })
        }

        try {

            const finduser = await prisma.user.findUnique({
                where: {
                    email: email
                }
            });

            if (finduser) {
                return res.json({
                    status: 400,
                    msg: "User already exists"
                });
            }


            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword, // Replace with actual password hashing logic
                    role,
                    phone,
                    user_type,
                    locationId,
                    status
                },
            });

            res.json({
                result: user, // Return the created user object
                msg: 'User registered successfully',
                status: 201,
            });
        } catch (error) {
            console.error('Error creating user:', error);
            next({
                status: 500,
                msg: 'Internal Server Error'
            });
        }
    }

    login = async (req, res, next) => {
        const { email, password } = req.body;
        const validationErrors = this.auth_svc.loginValidate({
            email,
            password
        });

        if (validationErrors) {
            next({
                status: 400,
                msg: validationErrors
            })
        }

        try {
            let user = await prisma.user.findUnique({
                where: {
                    email: email
                }
            });

            if (!user) {
                return res.json({
                    status: false,
                    msg: "User not found"
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.json({
                    status: false,
                    msg: "Invalid credentials"
                });
            }
            //Create token
            const token = this.auth_svc.generateToken({ id: user.id, email: user.email });
            res.json({
                status: true,
                result: user,
                msg: "User logged in successfully",
                access_token: token
            });

        } catch (error) {
            console.log(error)
            next({
                status: 500,
                msg: 'Internal Server Error'

            })
        }
    }

    verifyUser = (req, res, next) => {
        if (req.auth_user)
            res.json({
                result: req.auth_user,
                msg: "Verified",
                status: true
            });
        else
            next({
                status: 403,
                msg: "Unauthorized"
            })
    }
}

module.exports = AuthController;