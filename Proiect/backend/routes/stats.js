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






module.exports=router