const User = require('./user.modal');
const express = require('express');
const router = express.Router();


router.post('/saveUsers', function (req, res) {
    User.create(users, function (err, data) {
        if (err) {
            res.send(err)
        } else {
            console.log(data);
            res.send(data)
        }
    })
});


module.exports = router;


