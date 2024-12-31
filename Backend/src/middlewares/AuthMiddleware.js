
const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model');
// const User = require('../models/user.model')
const UserAuth =async (req, res, next) => {
  try {
    const cookeis = req.cookies;
    const {token} = cookeis;
  
    if (!token) {
      throw new Error("Token is not valid !")
    }
       
    const DecodedData = jwt.verify(token,"SERCRET@KEY123")
  
    const user = await User.findById({_id:DecodedData._id});
  
    if(!user){
      throw new Error('User not found ')
    }
    req.user = user // found user attahced into this request . Will be present in the request handler can be accessd like this :const user =  req.user 
    next()
  } catch (error) {
    res.status(401).json({"Error : " : error.message})
  }  
}

module.exports = {
    // AdminAuth,
    UserAuth
}