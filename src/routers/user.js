const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

const router = new express.Router()

router.post('/users', async (req, res) => {
    //req.body.password = await bcrypt.hash(req.body.password, 8)
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateToken()
       // req.session.username=req.body.username
        res.status(201).send({'Status':'Success','Description':'User Successfully Created',token})
    } catch(e) {
        res.status(400).send({'Status':'Error','Description':e})
    
    }

})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.logUserIn(req.body.username, req.body.password)
        const token = await user.generateToken()
        //req.session.username = req.body.username
        res.send({ 'Status':'Success','Description':'Login Successful',token })
    } catch (e) {
   res.status(400).send({'Status':'Error','Description':'Invalid Login Details'})
   
    }
})



module.exports = router