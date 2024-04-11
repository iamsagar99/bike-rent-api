const router = require("express").Router();
const VehicleController = require('../app/controller/vehicle.controller')
const loginCheck = require("../app/middleware/auth.middleware");
const { isAdmin,isAdminOrSelf } = require("../app/middleware/rbac.middleware");
const uploader = require('../app/middleware/file-upload.middleware')

const vc_ctrl = new VehicleController();


let setDestination = (req, res, next) => {
    req.dest = "vehicle"; 
    next()
}
router.post("/add",
    // loginCheck,
    setDestination,  
    uploader.array('images'),
    vc_ctrl.addVehicle
)


router.get('/',vc_ctrl.getAllVehicles)
router.get('/:id',vc_ctrl.getVehicleById)



module.exports = router;