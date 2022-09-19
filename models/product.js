const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    productImage: {
        type: String,
        required: true
    },
    status:{
        type: String,
        default: "Available"
    }
})

module.exports = mongoose.model("Product", productSchema)