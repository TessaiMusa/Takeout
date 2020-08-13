const mongoose = require("mongoose")

const TransactionSchema = new mongoose.Schema({
    foodName: {
        required: true,
        type: String
    },
    vendorName: {
        required: true,
        type: String
    },
    userName: {
        required: true,
        type: String
    },
    completed: {
        type: Boolean,
        default: false,
    },
    date: {
        type: String,
        default: Date.now
    }
})

const Transaction = mongoose.model('Transaction', TransactionSchema)

module.exports = Transaction