const express = require('express');
const { ConectDB } = require('./config/database.js');
const { User } = require('./models/user.model.js');
const validator = require('validator')
const cookieParser = require('cookie-parser');
const { authRouter } = require('./router/auth.js');
const { profileRouter } = require('./router/profile.js');
const { requestRouter } = require('./router/request.js');
const { userRouter } = require('./router/user.js');
const app = express();
app.use(express.json());
app.use(cookieParser())

app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',requestRouter)
app.use('/',userRouter)


// Get the data and store in the database



// app.post('/signin', async (req, res) => {

//     try {
//         const { emailId, password } = req.body;

//         if (!validator.isEmail(emailId)) {
//             throw new Error('The email is not valid')
//         }

//         const user = await User.findOne({ emailId: emailId })
//         const isPasswordValid = await user.verifyPassword(password)

//         if (isPasswordValid) {
//             const token = await user.getJWT()


//             res.cookie("token", token)
//             res.send("User logged in successfully")
//         } else {
//             throw new Error('invalid Credentials')
//         }



//     } catch (error) {
//         res.status(401).send("Error occure :", error.message)
//     }


// })





ConectDB().then(() => {
    console.log("MongoDB connected successfully");
    app.listen(3000, () => {
        console.log('Server is successfully listening on http://localhost:3000');
    });
}).catch((error) => {
    console.log('Error:', error.message);
});
