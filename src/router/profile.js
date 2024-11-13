const express = require('express')
const { UserAuth } = require('../middlewares/AuthMiddleware');
const { validateProfileEdit } = require('../utils/validation');
const { User } = require('../models/user.model');
const validator = require('validator')
const bcrypt = require('bcrypt')

const profileRouter = express.Router()

profileRouter.get('/profile/view', UserAuth, async (req, res) => {
    try {
        // const cookeis = req.cookies

        // if (!cookeis) {
        //     throw new Error("User is not Loggedin ~ ")
        // }
        // const {token} = cookeis ;       

        // const DecodedMessage = jwt.verify(token,"SERCRET@KEY123")

        // const loggedinUser = await User.findById({_id:DecodedMessage._id})

        // Dont need the Above code as it is already written in the Auth middleware . 
        const user = req.user // Comming from the middleware that is attached llike this , req.founduser = user 
        res.json({
            "Currently logged in : ": user
        })

    } catch (error) {
        res.status(401).send("Error occure : " + error.message)
    }

});
profileRouter.patch('/profile/edit', UserAuth, async (req, res) => {
  try {
    if (!validateProfileEdit(req)) {
        throw new Error("Invalid edit Data ");
        
    }

    const loggedinUser = req.user;
    console.log(loggedinUser)
    
    Object.keys(req.body).forEach((key)=> loggedinUser[key] = req.body[key])
    console.log(loggedinUser)
    await loggedinUser.save()
    res.send(loggedinUser)
  } catch (error) {
    res.status(401).send("Error occure :"+error.message)
  }
});
profileRouter.patch('/profile/password',UserAuth,async (req,res) => {
   try {
     const {existingPassword} = req.body;
     const user = req.user;
     let {newPassword} = req.body;
 
     const isPasswordCorrect = await user.verifyPassword(existingPassword)
 
     if (!isPasswordCorrect) {
         throw new Error("Invalid password");   
     } else if(!validator.isStrongPassword(newPassword)){
         throw new Error("Please enter the String password that includes : ");
         
     }
     newPassword = await bcrypt.hash(newPassword,10)

     user.password = newPassword;
     await user.save()
     console.log("password Updated successfully !!! ")
     res.json({message:`${user.firstName} Your password is successfully Updated !!`})

   } catch (error) {
    res.status(201).send("Error occure"+error.message)
   }
})

module.exports = { profileRouter }