const {user} = require("../models");
const asyncWrapper = require("../Middleware/async");
const { createCustomError } = require("../error/custom-error");
const Sequelize = require("sequelize")
const Op = Sequelize.Op;
const {StatusCodes} = require("http-status-codes");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createHash } = require("crypto");
const sendMail = require("../utils/sendMail");

// register route
exports.registerUser = asyncWrapper(async(req, res, next) => {
    const {role, firstname, lastname, email, password, confirmPassword} = req.body;
    console.log(req.body);
    if(!role || !firstname || !lastname || !email || !password || !confirmPassword){
        return next(createCustomError("Please fill in all the required fields", StatusCodes.OK));
    }
    if(!role || role === "DEFAULT" || role === " " ) return next(createCustomError("A role should either be an employer or talent", StatusCodes.OK));
    // find if user already exists
    const foundUser = await user.findOne({where: {[Op.or]: [{email}, {name: `${firstname} ${lastname}`}] }});
    if(foundUser) return next(createCustomError("Account already exists", StatusCodes.OK));
    // compare passwords if user doesn't exist 
    if(password !== confirmPassword) return next(createCustomError("Passwords do not match", StatusCodes.OK));
    // hash passwords if they match
    const hashedPassword = await bcrypt.hash(password, 16);
    // register user
    const result = await user.create({name: `${firstname} ${lastname}`, role,  email, password: hashedPassword});
    // payload
    const payload = {role: result.role, name: result.name, email: result.email, id: result.id, uuid: result.uuid}
    // generate token
    const token = jwt.sign(payload, "secretKey", {expiresIn: "50d"});
    // return user and token
    res.json({user: payload, token}).status(StatusCodes.CREATED);
});


// log in user
exports.loginUser = asyncWrapper(async(req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password){
        return next(createCustomError("Please fill in all the required fields", StatusCodes.OK));
    }
    // check if user exists
    const foundUser = await user.findOne({where: {email}});
    if(!foundUser) return next(createCustomError("Wrong email and password combination", StatusCodes.OK));
    // compare passwords if user exists
    const isPasswordsMatching = await  bcrypt.compare(password, foundUser.password);
    if(!isPasswordsMatching) return next(createCustomError("Wrong email and password combination", StatusCodes.OK));
    // payload
    const payload = {role: foundUser.role, name: foundUser.name, email: foundUser.email, id: foundUser.id, uuid: foundUser.uuid}
    // generate note   
    const token = jwt.sign(payload, "secretKey", {expiresIn: "50d"});
    // return user and token
    res.json({user: payload, token}).status(StatusCodes.CREATED);
});

// forgot password
exports.forgotPassword = asyncWrapper(async(req, res, next) => {
    // receive email from frontend
    const {email} = req.body;
    // find if user exists
    const user = await users.findOne({where: {email}});
    if(!user) return next(createCustomError("Email could not be sent", StatusCodes.NOT_FOUND));
    // generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.reset_token = createHash("sha256").update(resetToken).digest("hex");
    // time after which the token expires
    user.token_expiry = Date.now() + 10 * (60*1000);

    // save user
    user.save();

    // frontend reset url with token
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    // message
    const message = `
    <h2>You have requested a password reset link</h2>
    <p>Please go to this link to reset your password </p>
    <a href=${resetUrl} clicktracking=off>{resetUrl}</a>
    `
    // send mail
    try {
        await sendMail({
            to: user.email,
            subject: "Password reset link",
            text: message,
        })

        res.status(StatusCodes.OK).json({message: "Password reset link sent succesfully to your email"});
    } catch (error) {
        user.reset_token = undefined;
        user.token_expiry = undefined;

        await user.save()
        return next(createCustomError("Email could not be sent", StatusCodes.INTERNAL_SERVER_ERROR))
    }
});

// reset password
exports.resetPassword = asyncWrapper(async(req, res, next) => {
    // update token received from params
    const reset_token = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");
    // find user with the token
    const user = await users.findOne({where: {reset_token, token_expiry: {[Op.gt] : Date.now()}}});
    if(!user) return next(createCustomError("Invalid password reset token", StatusCodes.BAD_REQUEST))

    user.password = req.body.password;

    // after reset 
    user.reset_token = undefined;
    user.token_expiry = undefined;

    await user.save();

    res.status(StatusCodes.CREATED).json({message: "Password reset was succesful"});
});

// update password
exports.updatePassword = asyncWrapper(async(req, res, next) => {
    const userId = req.user.id;
    const {oldPassword, newPassword, confirmPassword} = req.body;
    // find the user
    const user = await users.findOne({where: {id: userId}});
    if(!user) return next(createCustomError("Password could not be updated", StatusCodes.NOT_FOUND));
    // check if old password matches user's password
    const isMatch = bcrypt.compare(oldPassword, user.password);
    if(!isMatch) return next(createCustomError("Your old password is wrong", StatusCodes.FORBIDDEN))
    // compare password
    if(newPassword !== confirmPassword) return next(createCustomError("Passwords do not match", StatusCodes.BAD_REQUEST));
    // hash password
    const hashedPassword = await bcrypt.hash(newPassword, 16);
    await users.update({password: hashedPassword},{where: {id: userId}});
    res.status(StatusCodes.CREATED).json({message: "Password updated succesfully!"});
});

// delete user
exports.deleteUser = asyncWrapper(async(req, res, next) => {
    const userId = req.user.id;
    // find user with the id
    const user = await users.findOne({where: {id: userId}});
    if(!user) return next(createCustomError("User not found", StatusCodes.NOT_FOUND))
    await user.destroy({where: {id: userId}});
    res.status(StatusCodes.OK).json({message: "Account deleted succesfully"});
});