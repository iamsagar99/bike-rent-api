const jwt = require("jsonwebtoken");
const CONFIG = require("../../config/config");
const prisma = require('../../config/pg.config.js');


const loginCheck = async (req, res, next) => {
    let token = null;
   
    if(req.headers['authorization']){
        token = req.headers['authorization'];   // ""
    }   

    if(req.headers['x-xsrf-token']){
        token = req.headers['x-xsrf-token'];
    }

    if(req.query['token']){
        token = req.query['token']
    }

    if(!token){
        next({
            status: 401,
            msg: "Unauthorized"
        })
    } else {
        // Bearer token
        // token
        try{
            let parts = token.split(" ");   // Bearer token, 1,, token 0
            token = parts[parts.length -1];
            let data = jwt.verify(token, CONFIG.JWT_SECRET);
            if(data) {
                // let user = await 
                console.log("first")
                let user = await prisma.user.findUnique({
                    where: {
                        email: data.email
                    }
                });
                if(user) {
                    req.auth_user = user;
                    next();
                } else {
                    next({
                        status: 403,
                        msg: "Access denied"
                    })
                }
            } else {
                next({
                    status: 401,
                    msg: "Unauthorized"
                })
            }
        } catch(e) {
            next({
                status: 401,
                msg: "Token not verified"
            })
        }

    }

}

module.exports = loginCheck;