const mongoose = require('mongoose')

const openPartiesSchema = new mongoose.Schema({
    partyId: {
        type:String,
        required:true,
    },
    userId: {
        type: String,
        required: true
    },
    favArtist: {
        type: String,
        required: true
    },
    favSong: {
        type: String,
        required:true
    },
    favGenre: {
        type:String,
        required: true
    },
    isDancing: {
        type: Boolean,
        required: true
    },
    nowPlaying: {
        type:String
    }
})

module.exports = mongoose.model('OpenParties', openPartiesSchema)