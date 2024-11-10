const express = require('express');
const { ConectDB } = require('./config/database.js');
const { User } = require('./models/user.model.js');
const validator = require('validator')
const ValidateSignUpData = require('./utils/validation.js');
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const { UserAuth } = require('./middlewares/AuthMiddleware.js');
const app = express();
app.use(express.json());
app.use(cookieParser())


// Get the data and store in the database
app.post('/signup', async (req, res) => {
    try {
        // 1.Validating of the data 
        const { firstName, lastName, emailId, password } = req.body
        ValidateSignUpData(req)
        // 2.Encrypting/hash the password 
        const passwordHash = await bcrypt.hash(password, 10)

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        })
        await user.save()
        res.status(201).send("User Created successfully!")
    } catch (error) {
        res.status(401).send("Error occure : " + error.message)
    }
});
app.post('/signin', async (req, res) => {
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
})
app.get('/Profile',UserAuth,async (req,res) => {
    try {
        // const cookeis = req.cookies

        // if (!cookeis) {
        //     throw new Error("User is not Loggedin ~ ")
        // }
        // const {token} = cookeis ;       

        // const DecodedMessage = jwt.verify(token,"SERCRET@KEY123")

        // const loggedinUser = await User.findById({_id:DecodedMessage._id})
        
        // Dont need the Above code as it is already written in the Auth middleware . 






        const user =  req.user // Comming from the middleware that is attached llike this , req.founduser = user 
        res.send("Currently logged in : - "+ user)

    }catch (error) {
        res.status(401).send("Error occure : " + error.message)
    }
   
})
app.post('/sendConnectionRequest',UserAuth,async(req,res)=>{
    const user = req.user

    console.log('Sending Connection Request !!')
    res.send(user.firstName+' Sent the   Conection Request  !! ')
})


ConectDB().then(() => {
    console.log("MongoDB connected successfully");
    app.listen(3000, () => {
        console.log('Server is successfully listening on http://localhost:3000');
    });
}).catch((error) => {
    console.log('Error:', error.message);
});
