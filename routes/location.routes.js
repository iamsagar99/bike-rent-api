const router = require("express").Router();
const LocationController = require("../app/controller/location.controller.js");
const loginCheck = require("../app/middleware/auth.middleware");
const { isAdmin,isAdminOrSelf } = require("../app/middleware/rbac.middleware");

const loc_ctrl = new LocationController();



router.post("/add",loc_ctrl.addLocation)

router.get('/:id',loc_ctrl.getLocationById)



module.exports = router;