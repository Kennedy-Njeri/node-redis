const jwt = require('jsonwebtoken')
const User = require('../models/users')




const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        //console.log(token)
        const decoded = jwt.verify(token, 'thisisnodejs')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        req.token = token

        // give the router handler access to the user we fetched from the database // store user fetched
        req.user = user

        // lets route handler run
        next()

    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.'})
    }
}


// const auth = (req, res, next) => {
//     // Get token from header
//     const token = req.header('x-auth-token');
//
//     // Check if not token
//     if (!token) {
//         return res.status(401).json({ msg: 'No token, authorization denied' });
//     }
//
//     try {
//         const decoded = jwt.verify(token, config.get('jwtSecret'));
//
//         req.user = decoded.user;
//         next();
//     } catch (err) {
//         res.status(401).json({ msg: 'Token is not valid' });
//     }
// }



module.exports = auth