const validator = require('validator')
const { User } = require('../models/user.model')

const express = require('express')
const {ValidateSignUpData} = require('../utils/validation')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const authRouter = express.Router()

authRouter.post('/signup', async (req, res) => {
    try {
        // 1.Validating of the data 
        const { firstName, lastName, emailId, password,age } = req.body
        ValidateSignUpData(req)
        // 2.Encrypting/hash the password 
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
            age
        })
        await user.save()
        res.status(201).send("User Created successfully!")
    } catch (error) {
        res.status(401).send("Error occure : " + error.message)
    }
});
authRouter.post('/signin', async (req, res) => {
    try {

        const { emailId, password } = req.body;

        if (!validator.isEmail(emailId)) {
            throw new Error('Pleaser enter correct email ')
        }

        const user = await User.findOne({ emailId: emailId })

        if (!user) {
            throw new Error('Invalid Credentials') // Email is not present in the Database
        }

        const isPasswordValid = await user.verifyPassword(password) // We have created the fucntion in the schemaLevel and retirung the value 


        if (isPasswordValid) {

            // Create a JWT token 
            const token =await user.getJWT()
            // Add the token into the cookei And send the response back 
            res.cookie('token',token)
            res.status(200).send("User Login successfully !!")
        } else {
            throw new Error('Invalid Credentials')
        }


    } catch (error) {
        res.status(401).send("Error occure : " + error.message)
    }
});
authRouter.post('/logout',async (req,res) => {
    res.cookie("token", null,{
        expires:new Date(Date.now())
    })

    res.send("Logged Out successfully ! ")
})

module.exports =  {authRouter}

