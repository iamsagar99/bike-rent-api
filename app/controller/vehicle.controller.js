const prisma = require('../../config/pg.config.js');


class VehicleController {
    addVehicle = async (req, res, next) => {
        try {
            let data = req.body;
            if (req.files) {
                let images = [];
                req.files.map((image) => {
                    images.push(image.filename)
                })
                data.images = images;
            }

            data.rent_price = parseInt(data.rent_price);
            data.ownerId = parseInt(data.ownerId)
            data.locationId = parseInt(data.locationId)







            let vehicle = await prisma.vehicle.create({
                data
            });
            res.json({
                result: vehicle,
                msg: "Vehicle added successfully",
                status: true
            })

        } catch (error) {
            next({
                status: 500,
                msg: 'Internal Server Error' + error
            })
        }
    }

    updateVehicle = async (req, res, next) => {
        try {
            let data = req.body;
            let { id } = req.params;
            if (req.files) {
                let images = [];
                req.files.map((image) => {
                    images.push(image.filename)
                })
                data.images = images;
            }

            let vehicle = await prisma.vehicle.update({
                where: {
                    id: parseInt(id)
                },
                data
            });
            res.json({
                result: vehicle,
                msg: "Vehicle updated successfully",
                status: true
            })

        } catch (error) {
            next({
                status: 500,
                msg: 'Internal Server Error' + error
            })
        }
    }

    getVehicleById = async (req, res, next) => {
        try {
            let { id } = req.params;
            const vehicle = await prisma.vehicle.findUnique({
                where: {
                    id: parseInt(id)
                },
                include: {
                    owner: true,
                    feedback: true,
                    category: true,
                    location: true
                }
            });

            if (!vehicle) {
                return res.json({
                    status: 404,
                    msg: 'Vehicle not found',
                });
            }
            res.json({
                result: vehicle,
                msg: "Vehicle fetched successfully",
                status: true
            })

        } catch (error) {
            next({
                status: 500,
                msg: 'Internal Server Error' + error
            })
        }
    }

    getAllVehicles = async (req, res, next) => {
        try {
            let filter = {};
            if (req.query) {
                filter = req.query;
            }
            let vehicles = await prisma.vehicle.findMany({
                where: filter
            });

            res.json({
                result: vehicles,
                msg: "Vehicles fetched successfully",
                status: true
            })

        } catch (error) {
            next({
                status: 500,
                msg: 'Internal Server Error' + error
            })
        }
    }

    getVehiclesNearLocation = async (req, res, next) => {
        const { latitude, longitude } = req.query;
        const rangeInKm = req.query.rangeInKm || 5;

        try {
            // Find the location based on latitude and longitude
            const location = await prisma.location.findFirst({
                where: {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                },
            });

            if (!location) {
                return res.status(404).json({
                    status: 404,
                    msg: 'Location not found',
                });
            }

            // Find vehicles within the specified range of the location
            const vehicles = await prisma.vehicle.findMany({
                where: {
                    locationId: location.id,
                    AND: [
                        {
                            latitude: {
                                gte: parseFloat(latitude) - (parseFloat(rangeInKm) / 110.574),
                                lte: parseFloat(latitude) + (parseFloat(rangeInKm) / 110.574),
                            },
                        },
                        {
                            longitude: {
                                gte: parseFloat(longitude) - (parseFloat(rangeInKm) / (111.320 * Math.cos(parseFloat(latitude)))),
                                lte: parseFloat(longitude) + (parseFloat(rangeInKm) / (111.320 * Math.cos(parseFloat(latitude)))),
                            },
                        },
                    ],
                },
            });

            return res.status(200).json({
                status: 200,
                msg: 'Vehicles found near the location',
                data: vehicles,
            });
        } catch (error) {
            console.error('Error finding vehicles:', error);
            return next({
                status: 500,
                msg: 'Internal Server Error',
            });
        }
    };

}

module.exports = VehicleController;