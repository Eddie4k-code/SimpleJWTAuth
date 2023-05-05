const jwt = require("jsonwebtoken");
const User = require("../models/User");


const verifyToken = async (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({ message: "You need a authorization token" });
    }


    const token = authorization.split(' ')[1];


    try {

        const { id } = jwt.verify(token, 'secret123');

        req.user = await User.findOne({ _id: id });

        next();


    } catch (err) {
        res.status(400).json({ message: 'You are not Authorized.' });
    }


}

module.exports = verifyToken;