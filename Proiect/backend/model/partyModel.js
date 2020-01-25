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
    start: {
        type:Date,
        required: true
    },
    end: {
        type:Date,
        required:true
    }
})

module.exports = mongoose.model('Parties', partySchema)