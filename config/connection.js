const mongoose = require('mongoose');
const mongodbURI = "mongodb://localhost/Socketdb";
const db = mongoose.connection;

mongoose.connect(mongodbURI);

db.on('open',function(err,data){
    if(err) console.log(err);
console.log("Connected to Database");
});

db.on('error',function(err,data){
    if(err) console.log(err);
console.log("Could not connect to Database");
});


module.exports = mongoose;