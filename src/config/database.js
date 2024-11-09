const mongoose = require('mongoose')


const ConectDB = async ()=>{
        await mongoose.connect('mongodb+srv://rahul:jxbfKkLumeUkwwGx@nodejs.23kbu.mongodb.net/devTinder')
}   


module.exports={ConectDB}