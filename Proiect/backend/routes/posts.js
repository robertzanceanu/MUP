const router = require('express').Router()
const verify = require('../global-functions/verifyToken')

router.get('/',verify ,(req,res) => {
    res.json(
        {
            posts:{
                title:'AA',
                eu:'ej'
                }
        })
})

module.exports = router