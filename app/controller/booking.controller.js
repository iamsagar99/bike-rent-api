const prisma = require('../../config/pg.config')

class BookingController {
    addBooking = async (req, res, next) => {
        try {
            let data = req.body;
            if (req.file) {
                data.image = req.file.filename
            }


            console.log("firstdata", data)
            data.clientId = parseInt(data.clientId);
            data.vehicleId = parseInt(data.vehicleId);
            data.total_payment = parseInt(data.total_payment);
            data.locationId = parseInt(data.locationId);
            data.discount = parseFloat(data.discount);
            data.booking_date = new Date(data.booking_date);
            data.return_date = new Date(data.return_date);

            let pad = data.total_payment - data.total_payment * data.discount / 100.0;
            data.price_after_discount = pad;
            console.log("firstddd")
            console.log("data", data)

            // Check if the vehicle is already booked for the requested dates
            const vehicleAvailable = await prisma.vehicle.findUnique({
                where: {
                    id: parseInt(data.vehicleId)
                }
            });

            if (!vehicleAvailable.availability) {
                return res.status(404).json({
                    msg: "Vehicle already reserved. It is not available right now.",
                    status: false
                });
            }

            //save booking
            let booking = await prisma.booking.create({
                data
            });

            // Update the vehicle availability status
            let vehicle = await prisma.vehicle.update({
                where: {
                    id: parseInt(data.vehicleId)
                },
                data: {
                    availability: false,
                }
            });
            res.json({
                result: booking,
                msg: "Booking added successfully",
                status: true
            });
        } catch (error) {
            next({
                status: 500,
                msg: 'Internal Server Error' + error
            });
        }
    }
    getAllBookings = async (req, res, next) => {
        try {
            const bookings = await prisma.booking.findMany({
                include: {
                    user: true, // Include the user related to each booking
                    vehicle: true, // Include the vehicle related to each booking
                    location: true // Include the location related to each booking
                }
            });

            res.json({
                result: bookings,
                msg: "All bookings retrieved successfully",
                status: true
            });
        } catch (error) {
            next({
                status: 500,
                msg: 'Internal Server Error' + error
            });
        }
    }
    getBookingsByFilter = async (req, res, next) => {
        try {
            const query = req.query;

            let filter = {};
            Object.keys(query).forEach(key => {
                if (key === 'userId' || key === 'vehicleId' || key === 'locationId') {
                    filter[key] = parseInt(query[key]);
                }
                if(key==='status'||key==='payment_status'){
                    filter[key]=query[key];
                }
                if(key==="booking_date"||key==="return_date"){
                    filter[key]=new Date(query[key]);
                }
            });

            // Fetch bookings based on the constructed filter
            const bookings = await prisma.booking.findMany({
                where: filter,
                include: {
                    user: true,
                    vehicle: true,
                    location: true
                }
            });

            res.json({
                result: bookings,
                msg: "Bookings retrieved successfully",
                status: true
            });
        } catch (error) {
            next({
                status: 500,
                msg: 'Internal Server Error' + error
            });
        }
    }
    updateBookingById = async (req, res, next) => {
        try {
            const { bookingId } = req.params;
            const updateFields = req.body;

            // Fetch the existing booking to determine its current state
            const existingBooking = await prisma.booking.findUnique({
                where: {
                    id: parseInt(bookingId)
                }
            });

            if (!existingBooking) {
                return res.status(404).json({
                    msg: "Booking not found"
                });
            }
            // Create an object to hold only the fields to be updated
            const updatedData = {};

            if (req.file) {
                updatedData.image = req.file.filename
            }


            // Determine which fields are present in the request body and update only those
            if (updateFields.booking_date) {
                updatedData.booking_date = new Date(updateFields.booking_date);
            }

            if (updateFields.return_date) {
                updatedData.return_date = new Date(updateFields.return_date);
            }

            if (updateFields.total_payment !== undefined) {
                updatedData.total_payment = parseInt(updateFields.total_payment);
            }

            if (updateFields.payment_status) {
                updatedData.payment_status = updateFields.payment_status;
            }
            if (updateFields.status) {
                updatedData.status = updateFields.status;
            }

            // Update the booking with the requested fields only
            const updatedBooking = await prisma.booking.update({
                where: {
                    id: parseInt(bookingId)
                },
                data: updatedData,
                // include: {
                //     user: true,
                //     vehicle: true,
                //     location: true
                // }
            });

            res.json({
                result: updatedBooking,
                msg: "Booking updated successfully",
                status: true
            });
        } catch (error) {
            next({
                status: 500,
                msg: 'Internal Server Error' + error
            });
        }
    }


}

module.exports = BookingController;