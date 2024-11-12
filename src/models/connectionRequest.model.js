const mongoose = require('mongoose')


const ConnectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true

    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true

    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignored","intrested","rejected","pending"],
            message:`{VALUE} is incorrect status type`
        }
         // enum is nothing but its just use to define that there should be only limited predifined values , as you see in the above code how to define 
    }
},{
    timestamps:true
})

ConnectionRequestSchema.pre('save',function(next){
    const connectionRequest = this;
    // Check if the from user id is same user id ; 

    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("You cant send the connection to your self ");
        
    }
    next()
})


const ConnectionRequest = mongoose.model('ConnectionRequest',ConnectionRequestSchema) 

module.exports = ConnectionRequest