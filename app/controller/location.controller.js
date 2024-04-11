const prisma = require('../../config/pg.config')

class LocationController{
    addLocation = async(req,res,next)=>{
        try {
            const location = await prisma.location.create({
                data:req.body
            });
            res.json({
                result: location,
                msg: 'Location added successfully',
                status: true,
            });
        } catch (error) {
            console.error('Error adding location:', error);
            next({
                status: 500,
                msg: 'Internal Server Error'
            }); 
        }
    }

    getLocationById = async(req,res,next)=>{
        const {id} = req.params;
        try {
            const location = await prisma.location.findUnique({
                where: {
                    id: parseInt(id),
                },
            });

            if(!location){
                return res.json({
                    status: 404,
                    msg: 'Location not found',
                });
            }
            
            res.json({
                result: location,
                msg: 'Location found successfully',
                status: true,
            });
        } catch (error) {
            console.error('Error getting location:', error);
            next({
                status: 500,
                msg: 'Internal Server Error'
            }); 
        }
    }

    getLocationByCoordinates = async(req,res,next)=>{
        const latitude = req.query.latitude;
        const longitude = req.query.longitude;

        try{

            const location = await prisma.location.findFirst({
                where:{
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude)
                }
            });

            if(!location){
                return res.json({
                    status: 404,
                    msg: 'Location not found',
                });
            }

            res.json({
                result: location,
                msg: 'Location found successfully',
                status: true,
            });
        }catch(err){
            console.error('Error getting location:', error);
            next({
                status: 500,
                msg: 'Internal Server Error'
            }); 
        }
    }
}

module.exports = LocationController;