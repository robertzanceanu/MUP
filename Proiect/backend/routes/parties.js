const router = require('express').Router()
var moment = require('moment')
const verify = require('../global-functions/verifyToken')
const { addPartyValidation } = require('../validation')
const Party = require('../model/partyModel')
const OpenParties = require('../model/openPartyModel')
const User = require('../model/userModel')
let {initSpotify, getRecommandations} = require('../global-functions/spotify')
let spotifyApi = initSpotify()

router.get('/getParties/:id', verify, async(req,res) => {
    try {
        const user = await User.findOne({_id:req.params.id})
        if(user.role === 'partyOrganizer') {
            const parties = await Party.find({creatorId: req.params.id})
            res.send({
                parties
            })
        } else {
            const parties = await Party.find({status: 'live'})
            const partiesWithoutCode = []
            const inParty = await OpenParties.findOne({userId:req.params.id})
            console.log('aaaa', inParty)
            parties.forEach(async(party,index) => {
                console.log(party)
                let found = false
                if(inParty) {
                    if(inParty.partyId === party.id) {
                        found = true
                    }
                }
                partiesWithoutCode.push({
                    _id:party.id,
                    name:party.name,
                    status:party.status,
                    inParty: found
                })
            })
            res.send({
                parties:partiesWithoutCode
            })
        }
    } catch(err) {
        res.status(400).send({
            error: {
                message:err,
                status:400
            }
        })
    }
})

router.post('/addParty', verify, async (req, res) => {
    const { error } = addPartyValidation(req.body)
    if (error) return res.status(400).send({
        error: {
            message: error.details[0].message,
            status: 400
        }
    })
    let code = ''
    let numberOfParties = await Party.count()
    let timeCombination = `${moment().get('minute')}${moment().get('second')}`
    code = `${numberOfParties}${timeCombination}`
    const party = new Party({
        creatorId: req.body.creatorId,
        status: 'open',
        duration: req.body.duration,
        name: req.body.name,
        createdAt: new Date(),
        partyCode: code
    })
    try {
        const createdParty = await party.save()
        res.send(createdParty)
    } catch (err) {
        res.status(400).send({
            error: {
                message: err,
                status: 400
            }
        })
    }
})
router.put('/startParty/:id', verify, async (req, res) => {
    const party = await Party.findOne({ _id: req.params.id })
    console.log(req.params.id)
    party.status = 'live'
    try {
        const savedParty = await party.save()
        res.send(savedParty)
    } catch (err) {
        res.status(400).send({
            error: {
                message: err,
                status: 400
            }
        })
    }
})
router.get('/getParty/:id', verify, async (req, res) => {
    try {
        const party = await Party.findOne({ _id: req.params.id })
        res.status(200).send(party)

    } catch (err) {
        res.status(400).send({
            error: {
                message: 'Petrecere inexistenta',
                status: 400
            }
        })
    }
})
router.get('/getLiveParty/statistics/:id', verify, async(req,res) => {
    try {
        const party =await OpenParties.find({partyId: req.params.id})
        let statistics = {
            numberOfPlayers: party.length
        }
        res.send({...statistics})
    } catch(err) {
        res.status(400).send({
            error: {
                message: 'Petrecerea nu este live',
                status:400
            }
        })
    }
})
router.get('/getLiveParty/nowPlaying/:id', verify, async(req,res) => {
    try {
        const party =await OpenParties.find({partyId: req.params.id})
        // console.log(party.length)
        // let statistics = {
        //     numberOfPlayers: party.length
        // }
        let nowPlaying = party[0].nowPlaying
        res.send({nowPlaying:nowPlaying})
    } catch(err) {
        res.status(400).send({
            error: {
                message: 'Petrecerea nu este live',
                status:400
            }
        })
    }
})
router.post('/joinParty/:id', verify, async (req, res) => {
    const party = await Party.findOne({ _id: req.params.id })
    if (party.partyCode !== req.body.partyCode)
        return res.status(400).send({
            error: {
                message: 'Codul petrecerii este gresit',
                status: 400
            }
        })
    if (party.status !== 'live') {
        return res.status(400).send({
            error: {
                message: 'Petrecerea nu este live! Contacteaza-l pe organizator!',
                status: 400
            }
        })
    }
    const addToOpenParty = new OpenParties({
        partyId: req.params.id,
        userId: req.body.userId,
        favArtist: req.body.favArtist,
        favSong: req.body.favSong,
        favGenre: req.body.favGenre,
        isDancing: 0,
        nowPlaying: 'none'
    })
    const userExistsInParty = await OpenParties.findOne({ userId: req.body.userId, partyId: req.params.id })
    if (userExistsInParty) {
        return res.status(400).send({
            error: {
                message: 'Deja esti inscris la aceasta petrecere',
                status: 400
            }
        })
    }
    const userExists = await OpenParties.findOne({ userId: req.body.userId })
    if (userExists) {
        return res.status(400).send({
            error: {
                message: 'Esti deja inscris intr-o petrece live',
                status: 400
            }
        })
    }
    const checkUserRole = await User.findOne({ _id: req.body.userId })
    if (checkUserRole.role === 'partyOrganizer') {
        return res.status(403).send({
            error: {
                message: 'Trebuie sa ai rolul de petrecaret pentru a putea participa la o petrecere',
                status: 403
            }
        })
    }
    try {
        const savedOpenParty = await addToOpenParty.save()
        res.send(savedOpenParty)
    } catch (err) {
        res.status(400).send({
            error: {
                message: err,
                status: 400
            }
        })
    }
})
router.get('/userOpenParty/:id', verify, async (req, res) => {
    try {
        const party = await OpenParties.findOne({ partyId: req.params.id, userId: req.body.userId })
        res.send({
            userOpenPartyId: party._id
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
// router.put('/userOpenParty/:id', verify, async (req, res) => {
//     const userOpenParty = await OpenParties.findOne({
//         _id: req.params.id
//     })
//     userOpenParty.favArtist= req.body.favArtist
//     userOpenParty.favSong= req.body.favSong
//     userOpenParty.favGenre= req.body.favGenre
//     try {
//         const savedUserOpenParty = await userOpenParty.save()
//         res.send(savedUserOpenParty)
//     } catch (err) {
//         res.status(400).send({
//             error: {
//                 message: err,
//                 status: 400
//             }
//         })
//     }
// })

router.put('/openParty/modifyDancing/:id', verify, async (req,res) => {
    let openParty = await OpenParties.findOne({partyId:req.params.id, userId:req.body.userId})
    openParty.isDancing = req.body.isDancing
    try {
        const openPartyUpdated = await openParty.save()
        res.send(openPartyUpdated)
    } catch(err) {
        res.status(400).send({
            error: {
                message:err,
                status:400
            }
        })
    }
})
router.get('/getNextSong/:id', verify, async(req, res) => {
    let liveParty = await OpenParties.find({partyId:req.params.id})
    console.log(liveParty)
    res.send(liveParty)
})
module.exports = router