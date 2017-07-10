const mongoose = require('mongoose');

const userSchema  = new mongoose.Schema({
    username:{
        type:String
    },
    password:{
        type:String
    },
    status:{
        type:String,
        default:"Online"
    },
    socketId:{}
});

module.exports = mongoose.model('User',userSchema);