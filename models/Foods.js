const mongoose = require("mongoose")

const FoodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    vendorName: {
        type: String,
        required: true
    },
    currentOffer: {
        type: Number,
        default: 0
    },
    sold: {
        type: Number,
        default: 0
    }
})

const Food = mongoose.model('Food', FoodSchema)

module.exports = Food