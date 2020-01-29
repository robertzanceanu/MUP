const router = require('express').Router()
var moment = require('moment')
const verify = require('../global-functions/verifyToken')
const { addPartyValidation } = require('../validation')
const Party = require('../model/partyModel')
const OpenParties = require('../model/openPartyModel')
const User = require('../model/userModel')
let { initSpotify, getRecommandations } = require('../global-functions/spotify')
let spotifyApi = initSpotify()

/**
 * @swagger
 * tags:
 *     name: Party
 *     description: All the routes affecting Archives
 */

/**
 * @swagger
 * /api/parties/getParties/{id}:
 *    get:
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *            required:
 *              - id
 *          required: true
 *          minimum: 1
 *          description: Parties id
 *      responses:
 *        200:
 *           description: fetch archives
 *      tags:
 *        - Party
 */


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


/**
 * @swagger
 * paths:
 *  /api/parties/addParty:
 *   post:
 *     descriptions: Use to create a party.
 *     produces:
 *        - "application/json"
 *     parameters:
 *       - in: body
 *         name: user
 *         description: Use to create a party
 *         schema:
 *           type: object
 *           required:
 *             - creatorId
 *             - status
 *             - duration
 *             - name
 *             - createdAt
 *             - partyCode
 *           properties:
 *             status:
 *               type: string
 *             duration:
 *               type: string
 *             creatorId:
 *               type: string
 *             name:
 *               type: string
 *             createdAt:
 *               type: string
 *               format: date-time
 *             partyCode:
 *               type: string
 *     responses:
 *       '200':
 *           description:A succesful response
 *     tags:
 *       - Party
 */
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
/**
 * @swagger
 * paths:
 *  /api/parties/startParty/{id}:
 *   put:
 *     descriptions: Use to create a party.
 *     produces:
 *        - "application/json"
 *     parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *            required:
 *              - id
 *          required: true
 *          minimum: 1
 *          description: Id party
 *        - in: body
 *          name: starts
 *          description: Status party
 *          schema:
 *              type: object
 *              requierd:
 *                  - starts
 *              properties:
 *                  starts: 
 *                      type:string
 *          
 *     responses:
 *       '200':
 *           description:A succesful response
 *     tags:
 *       - Party
 */
router.put('/startParty/:id', verify, async (req, res) => {
    const party = await Party.findOne({ _id: req.params.id })
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

/**
 * @swagger
 * /api/parties/getParty/{id}:
 *    get:
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *            required:
 *              - id
 *          required: true
 *          minimum: 1
 *          description: Party id
 *      responses:
 *        200:
 *           description: fetch archives
 *      tags:
 *        - Party
 */
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

/**
 * @swagger
 * /api/parties/getLiveParty/statistics/{id}:
 *    get:
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *            required:
 *              - id
 *          required: true
 *          minimum: 1
 *          description: Party id
 *      responses:
 *        200:
 *           description: fetch archives
 *      tags:
 *        - Party
 */
router.get('/getLiveParty/statistics/:id', verify, async (req, res) => {
    try {
        const party = await OpenParties.find({ partyId: req.params.id })
        let statistics = {
            numberOfPlayers: party.length
        }
        res.send({ ...statistics })
    } catch (err) {
        res.status(400).send({
            error: {
                message: 'Petrecerea nu este live',
                status: 400
            }
        })
    }
})

/**
 * @swagger
 * /api/parties/getLiveParty/nowPlaying/{id}:
 *    get:
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *            required:
 *              - id
 *          required: true
 *          minimum: 1
 *          description: Party id
 *      responses:
 *        200:
 *           description: fetch archives
 *      tags:
 *        - Party
 */
router.get('/getLiveParty/nowPlaying/:id', verify, async (req, res) => {
    try {
        const liveParty = await OpenParties.find({ partyId: req.params.id })
        // console.log(party.length)
        // let statistics = {
        //     numberOfPlayers: party.length
        // }
        const party = await Party.findOne({ _id: req.params.id })
        let nowPlaying = ''
        if (liveParty.length === 0 && party) {
            nowPlaying = "Nu sunt oameni inscrisi la petrecere"
        } else {
            nowPlaying = liveParty[0].nowPlaying
        }
        res.send({ nowPlaying: nowPlaying })
    } catch (err) {
        res.status(400).send({
            error: {
                message: 'Petrecerea nu este live',
                status: 400
            }
        })
    }
})

/**
 * @swagger
 * 
 * 
 * paths:
 *  /api/parties/joinParty/{id}:
 *   post:
 *     produces:
 *        - "application/json"
 *     parameters:
 *       - in: path
 *           name:id
 *           type:integer
 *       - in: body
 *         name: user
 *         description: Use to regist a user.
 *         schema:
 *           type: object
 *           required:
 *             - partyId
 *             - userId
 *             - favArtist
 *             - favSong
 *             - favGenre
 *             - isDancing
 *             - nowPlaying
 *           properties:
 *             partyId:
 *               type: string
 *             userId:
 *               type: string
 *             favArtist:
 *               type: string
 *             favSong:
 *               type: string
 *             favGenre:
 *               type: string
 *             isDancing:
 *               type: string
 *             nowPlaying:
 *               type:string  
 *     responses:
 *       '200':
 *           description:A succesful response
 *     tags:
 *       - Party
 */

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
        nowPlaying: 'none',
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
        console.log(await !Party.find({ _id: req.params.id }).partyGenres.include(req.body.favGenre))
        const updatePartyGenres = await Party.update(
            { _id: req.params.id },
            {
                $push: { "partyGenres": await !Party.find({ _id: req.params.id }).partyGenres.include(req.body.favGenre) }
            }
        )
        await updatePartyGenres.save()
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

/**
 * @swagger
 * /api/parties/userOpenParty/{id}:
 *    get:
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *            required:
 *              - id
 *          required: true
 *          minimum: 1
 *          description: Party id
 *      responses:
 *        200:
 *           description: fetch archives
 *      tags:
 *        - Party
 */
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

/**
 * @swagger
 * paths:
 *  /api/parties/openParty/modifyDancing/{id}:
 *   put:
 *     descriptions: Use to create a party.
 *     produces:
 *        - "application/json"
 *     parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *            required:
 *              - id
 *          required: true
 *          minimum: 1
 *          description: Id parties
 *        - in: body
 *          name: starts
 *          description: Status party
 *          schema:
 *              type: object
 *              requierd:
 *                  - starts
 *              properties:
 *                  starts: 
 *                      type:string
 *          
 *     responses:
 *       '200':
 *           description:A succesful response
 *     tags:
 *       - Party
 */
router.put('/openParty/modifyDancing/:id', verify, async (req, res) => {
    let openParty = await OpenParties.findOne({ partyId: req.params.id, userId: req.body.userId })
    openParty.isDancing = req.body.isDancing
    try {
        const openPartyUpdated = await openParty.save()
        res.send(openPartyUpdated)
    } catch (err) {
        res.status(400).send({
            error: {
                message: err,
                status: 400
            }
        })
    }
})
router.get('/playFirstSong/:id', verify, async (req, res) => {
    let liveParty = await OpenParties.find({ partyId: req.params.id })
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
    console.log(genres)
    let favGenre = ''
    let max = 0
    Object.keys(genres).forEach((item) => {
        if (genres[item] > max) {
            max = genres[item]
            favGenre = item
        }
    })
    console.log(favGenre)
    // let spotifyRecommandations = getRecommandations(spotifyApi, favGenre)
    Promise.resolve(getRecommandations(spotifyApi, favGenre))
        .then(async (data) => {
            // console.log('aici',data )
            await OpenParties.updateMany(
                { partyId: req.params.id },
                {
                    nowPlaying: `${data[0].name} ${data[0].artists[0].name}`,
                    nowGenre: favGenre
                }
            )
            // const saved = await playFirstSong.save()
            await Party.update(
                { _id: req.params.id },
                {
                    $push: { "playedSongs": `${data[0].name} ${data[0].artists[0].name}` }
                }
            )
            res.send({
                nowPlaying: `${data[0].name} ${data[0].artists[0].name}`
            })
        })
        .catch(err => {
            console.log(err)
        })
})

/**
 * @swagger
 * /api/parties/getNextSong/{id}:
 *    get:
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *            required:
 *              - id
 *          required: true
 *          minimum: 1
 *          description: Parties id
 *      responses:
 *        200:
 *           description: fetch archives
 *      tags:
 *        - Party
 */
router.get('/getNextSong/:id', verify, async (req, res) => {
    let liveParty = await OpenParties.find({ partyId: req.params.id })
    let party = await Party.findOne({ _id: req.params.id })
    let no = 0
    liveParty.map((p, index) => {
        if (p.isDancing === true)
            no++
    })
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
    let genresArray = []
    Object.keys(genres).forEach((item) => {
        let json = {}
        json.name = item
        json.value = genres[item]
        genresArray.push(json)
    })
    let sortedGenres = genresArray.sort((a, b) => b.value - a.value)
    console.log(sortedGenres)
    if (no >= liveParty.length / 2) {
        Promise.resolve(getRecommandations(spotifyApi, liveParty[0].nowGenre))
            .then(async (data) => {
                let nextSong = ''
                data.some((song, index) => {
                    if (!party.playedSongs.includes(`${song.name} ${song.artists[0].name}`)) {
                        nextSong = `${song.name} ${song.artists[0].name}`
                        return false
                    }
                })
                await OpenParties.updateMany(
                    { partyId: req.params.id },
                    {
                        nowPlaying: nextSong
                        // nowGenre: favGenre
                    }
                )
                await Party.update(
                    { _id: req.params.id },
                    {
                        $push: { "playedSongs": nextSong }
                    }
                )
                // // const saved = await playFirstSong.save()
                res.send({
                    nowPlaying: nextSong
                })
            })
            .catch(err => {
                console.log(err)
            })
    } else {
        let nextGenre = ''
        console.log(sortedGenres)
        sortedGenres.some((genre, index) => {
            console.log(genre.name, liveParty[0].nowGenre)
            if (liveParty[0].nowGenre !== genre.name) {
                console.log('intra?')
                nextGenre = genre.name
                return true
            }
        })
        console.log(nextGenre)
        Promise.resolve(getRecommandations(spotifyApi, nextGenre))
            .then(async (data) => {
                let nextSong = ''
                data.some((song, index) => {
                    if (!party.playedSongs.includes(`${song.name} ${song.artists[0].name}`)) {
                        console.log('aici')
                        nextSong = `${song.name} ${song.artists[0].name}`
                        return true
                    }
                })
                await OpenParties.updateMany(
                    { partyId: req.params.id },
                    {
                        nowPlaying: nextSong,
                        nowGenre: nextGenre
                    }
                )
                await Party.update(
                    { _id: req.params.id },
                    {
                        $push: { "playedSongs": nextSong }
                    }
                )
                res.send({
                    nowPlaying: nextSong
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

})
module.exports = router