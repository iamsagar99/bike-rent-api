const express = require("express");
const app = express();

const auth_routes = require('./auth.routes')
const user_routes = require('./user.routes')
const vehicle_routes = require('./vehicle.routes')
const location_routes = require('./location.routes')

app.use('/user',user_routes);
app.use('/auth',auth_routes); 
app.use('/vehicle',vehicle_routes)
app.use('/location',location_routes)


module.exports = app;