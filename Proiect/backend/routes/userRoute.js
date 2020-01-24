const auth = require('../middleware/auth')
const bcrypt = require("bcrypt")
const {User,validate} = require('../models/userModel')
const express = require('express')

const router = express.Router()

router.get('/current', auth, async(req,res) => {
    const user = await User.findById(req.user._id).select('-password')
    res.send(user)
})

router.post('/', async(req,res) => {
    const {error} = validate(req.body)
    console.log('aaaa',req.body)
    if (error)
    {
        console.log(error)
        return res.status(400).send(error.details[0].message)
    } 

    let user = await User.findOne({email: req.body.email})
    if (user) return res.status(400).send('User already registered')

    user = new User({
        password: req.body.password,
        email:req.body.email,
        firstName:req.body.firstName,
        lastName: req.body.lastName,
        role:req.body.role
    })

    user.password = await bcrypt.hash(user.password, 10)
    await user.save()

    const token = user.generateAuthToken()

    res.header('x-auth-token',token).send({
        _id:user.id,
        name:`${user.firstName} ${user.lastName}`,
        email: user.email
    })
})

module.exports= router