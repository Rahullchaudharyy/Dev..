const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const ConectDB = async ()=>{
        await mongoose.connect(process.env.DB_URL)
}   


module.exports={ConectDB}