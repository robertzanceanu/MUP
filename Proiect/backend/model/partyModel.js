const mongoose = require('mongoose')

const partySchema = new mongoose.Schema({
    creatorId: {
        type:String,
        required:true
    },
    status: {
        type:String,
        required:true
    },
    partyCode: {
        type:String,
        required:true
    },
    duration: {
        type:String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Party', partySchema)