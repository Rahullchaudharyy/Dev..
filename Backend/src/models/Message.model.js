const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    text: String,

    timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", MessageSchema);

module.exports =  { Message };

