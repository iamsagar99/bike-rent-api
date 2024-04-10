const router = require("express").Router();
const AuthController= require("../app/controller/auth.controller.js");
// const loginCheck = require("../app/middleware/auth.middleware");


const auth_ctrl = new AuthController();


// http://localhost:9001/api/v1/register
router.post('/register',auth_ctrl.register)
router.post('/login', auth_ctrl.login)

// router.get("/login-verify",loginCheck,auth_ctrl.verifyUser);


module.exports = router;