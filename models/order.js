const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    product: {
        type: Array,
        required: true
    },
    bust: {
        type: Number,
        required: true
    },
    fullLength: {
        type: Number,
        required: true
    },
    armLength: {
        type: Number,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    additionalInfo: {
        type: String
    },
    paymentProof: {
        type: String
    },
    status: {
        type: String,
        default: "order received"
    },
})

module.exports = mongoose.model("Order", orderSchema)