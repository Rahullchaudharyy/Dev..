const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const ConectDB = async () => {
        try {
                await mongoose.connect(process.env.DB_URL)
                    console.log("MongoDB connected successfully");
                
        } catch (error) {
                console.log(error.message)
        }

}


module.exports = { ConectDB }