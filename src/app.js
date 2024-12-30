const express = require('express');
const { ConectDB } = require('./config/database.js');
const { User } = require('./models/user.model.js');
const validator = require('validator')
const cookieParser = require('cookie-parser');
const { authRouter } = require('./router/auth.js');
const { profileRouter } = require('./router/profile.js');
const { requestRouter } = require('./router/request.js');
const { userRouter } = require('./router/user.js');
const cors = require('cors')
const app = express();
const dotenv = require('dotenv')
dotenv.config();


app.use(cors({
  origin: 'http://localhost:5173',  // Specify the frontend's origin
  credentials: true,  // Allow credentials
}));


app.use(express.json());
app.use(cookieParser())

app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',requestRouter)
app.use('/',userRouter)


// Get the data and store in the database




ConectDB().then(() => {
    console.log("MongoDB connected successfully");
    app.listen(3000, () => {
        console.log('Server is successfully listening on http://localhost:3000');
    });
}).catch((error) => {
    console.log('Error:', error.message);
});
