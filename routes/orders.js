const express = require("express");
const Order = require("../models/order");
const { authorizeUser } = require("../auth/auth");
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./payments/");
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
     if(file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png"){
         cb(null, true)
     }
     else{
         cb(null, false)
     }
}
const upload = multer({storage: storage, 
                       limits: {fileSize: 1024 *1024 * 5},
                       fileFilter: fileFilter
                     });

//get all orders
router.get('/', authorizeUser, (req, res) => {
    Order.find()
    .exec()
    .then((results) => {
        const response = {
            NoOfOrders: results.length,
            message: "orders fetched",
            orders: results.map(result => {
                return{
                    orderId: result._id,
                    userId: result.userId,
                    firstName: result.firstName,
                    lastName: result.lastName,
                    product: result.product,
                    bust: result.bust,
                    fullLength: result.fullLength,
                    armLength: result.armLength,
                    phone: result.phone,
                    deliveryAddress: result.deliveryAddress,
                    additionalInfo: result.additionalInfo,
                    paymentProof: result.paymentProof,
                    status: result.status
                }
            })
            
        }
        res.status(200).json(response);
    })
    .catch((err) => {
        res.status(404).json({
            error: err
        })
    })
  
});


//get individual orders
router.get("/:id", authorizeUser, (req, res) => {
    const orderId = req.params.id
    Order.findById({_id: orderId})
    .exec()
    .then((result) => {
        res.status(200).json({
             message: "order fetched",
             order: result
        })
    })
    .catch((err) => {
        res.status(404).json({
            error: err
        })
    })
})


//post a new order
router.post('/', upload.single('paymentProof'), authorizeUser, (req, res) => {
    console.log(req.file)
     const order = new Order({
        userId: req.body.userId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        product: req.body.product,
        bust: req.body.bust,
        fullLength: req.body.fullLength,
        armLength: req.body.armLength,
        phone: req.body.phone,
        deliveryAddress: req.body.deliveryAddress,
        additionalInfo: req.body.additionalInfo,
        paymentProof: req.file.path
    });
     order
     .save()
     .then((result)=> {
         res.status(201).json({
             message: "order created",
             createdOrder: result
         })
     })
    
     .catch((err) => {
         res.status(401).json({
             message: "an error occured",
             error: err
         })
     })
});


//edit order details
router.patch("/:id", authorizeUser, (req, res) => {
    const orderId = req.params.id
    const newData = req.body
    Order.findByIdAndUpdate({_id: orderId}, {$set: newData})
    .exec()
    .then((result) => {
        res.status(200).json({
            message: "order updated",
            updatedData: result
        })
    })
    .catch((err) => {
        res.status(500).json({
            message: "an error occured",
            error: err
        })
    })
})


//delete order
router.delete("/:id", authorizeUser, (req, res) => {
    const orderId = req.params.id
    Order.findByIdAndRemove({_id: orderId})
    .exec()
    .then((result) => {
        res.status(200).json({
            message: "order deleted"
        })
    })
    .catch((err) => {
        res.status(500).json({
            error: err
        })
    })
})

module.exports = router;
