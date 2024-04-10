const router = require("express").Router();
const UserController = require("../app/controller/user.controller");
const AuthController = require("../app/controller/auth.controller");
const loginCheck = require("../app/middleware/auth.middleware");
const { isAdmin,isAdminOrSelf } = require("../app/middleware/rbac.middleware");

const usr_ctrl = new UserController();
const auth_ctrl = new AuthController();



router.put('/:id',loginCheck,isAdminOrSelf,usr_ctrl.updateUserById)
router.delete('/:id',loginCheck,isAdminOrSelf,usr_ctrl.deleteUserById)
router.get('/',loginCheck,isAdmin,usr_ctrl.getAllUsers)
router.get('/:id',usr_ctrl.getUserById)
//para que funcione el post hay que descomentar el middleware de auth.middleware.js en la ruta /users en auth.routes.js
//para que el metodo post funciones hay que descomentar el middleware de auth.middleware.js en la ruta /users en auth.routes.js


router.get("/login-verify",loginCheck,auth_ctrl.verifyUser);


module.exports = router;