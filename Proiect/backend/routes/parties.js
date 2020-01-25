const router = require('express').Router()
const verify = require('../global-functions/verifyToken')
const { addPartyValidation } = require('../validation')

router.post('/addParty',verify, (req,res) => {
    const {error} = addPartyValidation(req.body)
    if(error) return res.status(400).send({
        error: {
            message: error.details[0].message
        }
    })
})