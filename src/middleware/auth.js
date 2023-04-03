const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req,res,next) => {
    try {   
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        /// its find the given user and with 2rd parameter, it will check if the token value provided is present in user tokens field 
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token});
        if (!user) {
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    } catch(err) {
        res.status(401).send({error: 'Please authenticate'});
    }
}

module.exports = auth;