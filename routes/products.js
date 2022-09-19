const express = require("express");
const Product = require("../models/product");
const { authorizeUser } = require("../auth/auth");
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
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


//get all products
router.get('/', (req, res) => {
    Product.find()
    .exec()
    .then((results) => {
        const response = {
            NoOfProducts: results.length,
            message: "products fetched",
            products: results.map(result => {
                return{
                    productId: result._id,
                    category: result.category,
                    price: result.price,
                    productImage: result.productImage,
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

//get individual products
router.get("/:id", (req, res) => {
    const productId = req.params.id
    Product.findById({_id: productId})
    .exec()
    .then((result) => {
        res.status(200).json({
             message: "product fetched",
             product: result
        })
    })
    .catch((err) => {
        console.log(err)
        res.status(404).json({
            error: err
        })
    })
})

//post a new product
router.post('/', upload.single('productImage') , authorizeUser, (req, res) => {
    console.log(req.file);
    const product = new Product({ 
       category: req.body.category,
       price: req.body.price,
       productImage: req.file.path
   });
    product
    .save()
    .then((result) => {
        res.status(201).json({
            message: "product posted",
            postedProduct: result
        })
    })
   
    .catch((err) => {
        console.log(err)
        res.status(401).json({
            message: "an error occured",
            error: err
        })
    })
});

//edit product details
router.patch("/:id", authorizeUser, (req, res) => {
    const productId = req.params.id
    const newData = req.body
    Product.findByIdAndUpdate({_id: productId}, {$set: newData})
    .exec()
    .then((result) => {
        res.status(200).json({
            message: "product updated",
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

//change product status
router.patch('/:id/outOfStock', authorizeUser, (req, res) =>{
    const id = req.params.id;
    const newData = req.body;
    Product.findByIdAndUpdate({_id: id}, newData)
    .exec()
    .then((result)=> {
        res.status(200).json({
            message: 'out of stock',  
            updatedData: result
        })
    })
    .catch((err) => {
        res.status(500).json({
            message: 'an error occured',
            error: err
        })
    })  
});

//delete product
router.delete("/", authorizeUser, (req, res) => {
    const productId = req.params.id
    Product.findByIdAndRemove({_id: productId})
    .exec()
    .then((result) => {
        res.status(200).json({
            message: "product deleted"
        })
    })
    .catch((err) => {
        res.status(500).json({
            error: err
        })
    })
})

module.exports = router;