class CustomError extends Error {
   constructor(message, statusCodes){
       super(message)
       this.statusCodes = statusCodes
   }
}

const createCustomError = (message, statusCodes) => {
    return new CustomError(message, statusCodes)
}

module.exports = {CustomError, createCustomError}