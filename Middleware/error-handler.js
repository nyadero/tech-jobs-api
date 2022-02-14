const {StatusCodes} = require("http-status-codes");
const { CustomError } = require("../error/custom-error");
const errorHandlerMiddleware = (error, req, res, next) => {
   console.log({Error: error});
   if(error instanceof CustomError){
      return res.status(error.statusCodes).json({message: error.message});
   }
   return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong! Please try again later"})
}

module.exports = errorHandlerMiddleware;