const express = require('express');
const { generateToken, authorizeUser } = require("../auth/auth");
const User = require('../models/user');
const Order = require('../models/order');
const bcrypt = require('bcryptjs');
const router = express.Router();


//register a new user

router.post('/register', (req, res) => {
    User.find({email: req.body.email})
      .exec()
      .then((user) => {
        if(user.length >= 1) {
          res.status(409).json({ 
            message: "mail exists"
           });
        }
        else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if(err) {
              return res.status(500).json({ error: err });
            } else {
              const user = new User({
                username: req.body.username,
                email: req.body.email,
                password: hash
               });
  
               user
               .save()
               .then((result) => {
                 console.log(result);
                 generateToken(user, (err, token) => {
                  if(err){
                    console.log(err)
                  }
                  else{
                    console.log(user, token)
                    res.status(200).json({
                    message: 'user created',
                    user: result,
                    token: token
                   })
                 }
               });
               })
               .catch((err) =>{
                 console.log(err);
                 res.status(500).json({
                   message: "error: " + err
                 })
               })
              }
              })
                }

            })
            .catch((err) => {
              res.status(404).json({
                message: 'an error occured' + err
              })
            })
        
 });

 //login a user

 router.post('/login', (req, res) => {
    User.find({email: req.body.email})
    .then((user) => {
        if(user.lenght < 1){
           return res.status(401).json({
                message: 'Auth failed'
            });
        }
           bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if(err) {
            return res.status(401).json({
                message: "Auth failed"
                   }) 
                }
        if(result) {
            console.log(result);
            generateToken(user[0], (err, token) => {
                if(err){
                 console.log("error", err);
                }
                else{
                  res.status(200).json({
                  message: "Auth successful",
                  user: user[0],
                  token: token
                    })
                }
    });
}

        else{
            res.status(401).json({
                message: "Auth failed"
                }) 
            }   
        }
            )
        })
        .catch((err) => {
            res.status(401).json({
                error: err,
                message: "Auth failed"
            })
        })
});


//delete a user
router.delete('/:id/delete', (req, res) => {
    const userId = req.params.id;
    User.findByIdAndRemove({_id: userId})
    .exec()
    .then((result) => {
        console.log(result);
        res.status(200).json({
            message: 'user deleted'
        })
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err

        })
    })
});


//get a user's order
router.get('/:userId/order', (req, res) => {
      Order.find({userId: req.params.userId})
      .exec()
      .then((orders) => {
          res.status(200).json({
              orders: orders
          });
        })
        .catch((err) =>{
            res.json({
                message: 'an error occured',
                error: err
            })
        })
     });
module.exports = router;