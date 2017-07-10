const mongoose = require('mongoose');

const chatSchema  = new mongoose.Schema({
    message:{
        type:Object
    },
    postedBy:{
        type:String
    }
});

module.exports = mongoose.model('Chat',chatSchema);