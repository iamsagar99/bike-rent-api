const express = require("express");
const app = express();

const auth_routes = require('./auth.routes')
const user_routes = require('./user.routes')



app.use('/user',user_routes);
app.use('/auth',auth_routes); 


module.exports = app;