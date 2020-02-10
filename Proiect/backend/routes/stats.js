const router = require('express').Router()
var moment = require('moment')
const verify = require('../global-functions/verifyToken')
const { addPartyValidation } = require('../validation')
const Party = require('../model/partyModel')
const OpenParties = require('../model/openPartyModel')
const User = require('../model/userModel')
let { initSpotify, getRecommandations } = require('../global-functions/spotify')
let spotifyApi = initSpotify()


router.get('/getParties/:id', verify, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id })
        if (user.role === 'partyOrganizer') {
            const parties = await Party.find({ creatorId: req.params.id })
            res.send({
                parties
            })
        } else {
            const parties = await Party.find({ status: 'live' })
            const partiesWithoutCode = []
            const inParty = await OpenParties.findOne({ userId: req.params.id })
            parties.forEach(async (party, index) => {
                let found = false
                if (inParty) {
                    if (inParty.partyId === party.id) {
                        found = true
                    }
                }
                partiesWithoutCode.push({
                    _id: party.id,
                    name: party.name,
                    status: party.status,
                    inParty: found
                })
            })
            res.send({
                parties: partiesWithoutCode
            })
        }
    } catch (err) {
        res.status(400).send({
            error: {
                message: err,
                status: 400
            }
        })
    }
})


router.get('/getPartiesGenres', verify, async (req, res) => {
    try {
        let liveParty = OpenParties
        let genres = {}
        liveParty.map((user, index) => {
            // genres.push()
            if (genres.hasOwnProperty(`${user.favGenre.toLowerCase()}`)) {
                genres[`${user.favGenre.toLowerCase()}`] = genres[`${user.favGenre.toLowerCase()}`] + 1
            }
            else {
                genres[`${user.favGenre.toLowerCase()}`] = 1
            }
        })
        console.info(genres)
        let favGenre = ''
        let max = 0
        Object.keys(genres).forEach((item) => {
            if (genres[item] > max) {
                max = genres[item]
                favGenre = item
            }
        })
        console.info(favGenre)
        Object.keys(genres).pop(favGenre);
        
        let favGenre1=''
        let max1=0
        Object.keys(genres).forEach((item) => {
            if (genres[item] > max1) {
                max1 = genres[item]
                favGenre1 = item
            }
        })
        console.info(favGenre1)
        Object.keys(genres).pop(favGenre1);

        let favGenre2=''
        let max2=0
        Object.keys(genres).forEach((item) => {
            if (genres[item] > max2) {
                max2 = genres[item]
                favGenre2 = item
            }
        })
        console.info(favGenre2)
        Object.keys(genres).pop(favGenre2);
        res.send({
            fav1:favGenre,
            fav2:favGenre1,
            fav3:favGenre2
        })

    } catch (err) {
        res.status(400).send({
            error: {
                message: err,
                status: 400
            }
        })
    }
})





module.exports=router