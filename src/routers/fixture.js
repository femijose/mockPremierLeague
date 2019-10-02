const express = require('express')
const Fixture = require('../models/fixture')
const auth = require('../middleware/auth')
const isAdmin = require('../utility/utility')
const redis = require('redis')
const admin = require('../middleware/admin')
const redisPort = process.env.REDIS_PORT

const client = redis.createClient(redisPort)


const router = new express.Router()

router.post('/fixtures',[auth,admin], async (req, res) => {
   // console.log(req)
   // isAdmin(req,res)
    const fixture = new Fixture(req.body)
    fixture.fixtureLink = '/'+fixture._id.toString()
    try {
        await fixture.save()
        res.status(201).send({'Status':'Success','Description':'Fixture Successfully Created'})
    } catch(e) {
        res.status(400).send({'Status':'Error','Description':e})
    } 

})

router.get('/fixtures',auth, async (req,res) => {
    const fixturesRedisKey = 'fixtures';
    client.get(fixturesRedisKey, async (err, fixtures) => {
        if (fixtures) {
            return res.send({'Status':'Success','Description':'Fixtures Successfully Fetched','Fixtures':JSON.parse(fixtures)})
        } 
        else {
            try {
            const fixtures = await Fixture.find({})
            if (fixtures.length == 0) {
                return res.status(404).send({'Status':'Success','Description':'No Record Found'})
            }
            fixtures.forEach((fixture) => {
            fixture.fixtureLink = req.headers.host+'/fixtures'+fixture.fixtureLink
            }) 
            client.setex(fixturesRedisKey, 3600,JSON.stringify(fixtures))
            res.send({'Status':'Success','Description':'Fixtures Successfully Fetched','Fixtures':fixtures})
            } catch(e){
                res.status(500).send({'Status':'Error','Description':e})
            }
        }       
    })
})

router.get('/fixtures/:id',auth, async (req, res) => {
    const id = req.params.id
    const fixturesIndRedisKey = 'fixtures'+id;
    client.get(fixturesIndRedisKey, async (err, fixture) => {   
        if (fixture) {
            return res.send({'Status':'Success','Description':'Fixture Successfully Fetched','Fixture':JSON.parse(fixture)})
        } 
        else {
            try {
                const fixture = await Fixture.findById(id)
                if (!fixture) {
                    return res.status(404).send({'Status':'Success','Description':'No Record Found'})
                }
                fixture.fixtureLink = req.headers.host+'/fixtures'+fixture.fixtureLink
                client.setex(fixturesIndRedisKey, 3600,JSON.stringify(fixture))
                res.send({'Status':'Success','Description':'Fixture Successfully Fetched','Fixture':fixture})
            } catch(e) {
                res.status(500).send({'Status':'Error','Description':e})
            }
        }
    })
})

router.get('/fixtures/status/:status',auth, async (req, res) => {
    const status = req.params.status
        if (status.toLowerCase() == 'completed' || status.toLowerCase() == 'pending') {
            var completed = false
            if (status.toLowerCase() == 'completed') completed = true
            const fixtureStatusKey = 'status'+completed;
            client.get(fixtureStatusKey, async (err, fixtures) => {   
                if (fixtures) {
                    return res.send({'Status':'Success','Description':'Fixtures Successfully Fetched','Fixtures':JSON.parse(fixtures)})
                } 
                else {
                    try {
                        const fixtures = await Fixture.find({completed})
                        if (!fixtures) {
                            return res.status(404).send({'Status':'Success','Description':'No Record Found'})
                        }
                        if (fixtures.length == 0) {
                            return res.status(404).send({'Status':'Success','Description':'No Record Found'})
                        }
                        fixtures.forEach((fixture) => {
                        fixture.fixtureLink = req.headers.host+'/fixtures'+fixture.fixtureLink
                        }) 
                        client.setex(fixtureStatusKey, 3600,JSON.stringify(fixtures))
                        res.send({'Status':'Success','Description':'Fixtures Successfully Fetched','Fixtures':fixtures})
                    } catch(e) {
                        res.status(500).send({'Status':'Error','Description':e})
                    }
                }
            })
        } else {
            return res.status(404).send({'Status':'Success','Description':'Incorrect Value of Status. Please Pass completed or pending'})
        }
    })

router.patch('/fixtures/:id',[auth,admin], async (req, res) => {
   // isAdmin(req,res)
    const id = req.params.id
    const updates = Object.keys(req.body)
    const allowedFields = ['homeTeam','awayTeam','fixtureDate','homeTeamScore','awayTeamScore','completed']
    const isValidField = updates.every((update)=> allowedFields.includes(update))
    if(!isValidField) {
        return res.status(400).send({'Status':'Error','Description': 'Please Ensure Field Only Existing Fields are Updated'})
    }
    try {
        const fixture = await Fixture.findByIdAndUpdate(id,req.body, {new:true, runValidators: true})
        if (!fixture) {
            return res.status(404).send({'Status':'Error','Description':'No Record Found'})
        }
        res.send({'Status':'Success','Description':'Fixture Successfully Updated'})
      } catch(e) {
          res.status(500).send({'Status':'Error','Description':e})
      }
})

router.delete('/fixtures/:id',[auth,admin], async (req, res) => {
   //isAdmin(req,res)
    const id = req.params.id
    try {
        const fixture = await Fixture.findByIdAndDelete(id)
        if (!fixture) {
            return res.status(404).send({'Status':'Error','Description':'No Record Found'})
        }
        res.send({'Status':'Success','Description':'Fixture Successfully Deleted'})
      } catch(e) {
          res.status(500).send({'Status':'Error','Description':e})
      }
})


module.exports = router