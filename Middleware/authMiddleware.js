const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { createCustomError } = require("../error/custom-error");

const authMiddleWare = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    console.log({token});
    if(!token){
        console.log({Error: "You are not logged in"});
        return next(createCustomError("You are not logged in", StatusCodes.NOT_FOUND))
    }
    try {
        const validToken = await jwt.verify(token, "secretKey");
        console.log(validToken);
        req.user = validToken;
        console.log(req.user);
        next();
    } catch (error) {
        console.log({Error: error});
    }
}

module.exports = {authMiddleWare}