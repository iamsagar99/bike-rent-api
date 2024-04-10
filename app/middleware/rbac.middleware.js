const isAdmin = (req, res, next) => {
    let role = req.auth_user.role;
    if(role.includes('admin')) {
        next();
    } else {
        next({
            status: 403,
            msg: "Unauthorized"
        })
    }
}

const isRenter = (req, res, next) => {
    let role = req.auth_user.role;
    if(role.includes('renter')) {
        next();
    } else {
        next({
            status: 403,
            msg: "Unauthorized"
        })
    }
}

const isCustomer = (req, res, next) => {
    let role = req.auth_user.role;
    if(role.includes('customer')) {
        next();
    } else {
        next({
            status: 403,
            msg: "Unauthorized"
        })
    }
}


const isAdminRenter = (req,res,next) => {
    let role = req.auth_user.role;
    if(role.includes('admin') || role.includes('renter')){
        next();
    } else {
        next({
            status: 403,
            msg: "Unauthorized"
        })
    }
}

//for update,delete purpose
const isAdminOrSelf = (req,res,next)=>{
    let role = req.auth_user.role;
    let id = req.params.id;
    if(role.includes('admin') || req.auth_user.id == id){
        next();
    } else {
        next({
            status: 403,
            msg: "Unauthorized"
        })
    }

}

module.exports = {
    isAdmin,
    isAdminRenter,
    isCustomer,
    isRenter,
    isAdminOrSelf
}