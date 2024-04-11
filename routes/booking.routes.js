const router = require("express").Router();
const BookingController = require("../app/controller/booking.routes");
const loginCheck = require("../app/middleware/auth.middleware");
const { isAdmin,isAdminOrSelf } = require("../app/middleware/rbac.middleware");
const uploader = require('../app/middleware/file-upload.middleware')
const bk_ctrl = new BookingController()



let setDestination = (req, res, next) => {
    req.dest = "document"; 
    next()
}
router.post("/add",
    // loginCheck,
    setDestination,  
    uploader.single('image'),
    bk_ctrl.addBooking
)

router.get('/',bk_ctrl.getBookingsByFilter)
router.get('/all',bk_ctrl.getAllBookings)
router.put('/:id',bk_ctrl.updateBookingById)



module.exports = router;