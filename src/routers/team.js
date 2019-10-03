const express = require('express')
const Team = require('../models/team')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const isAdmin = require('../utility/utility')
const redis = require('redis')
const redisPort = process.env.REDIS_PORT

const client = redis.createClient(redisPort)

const router = new express.Router()

router.post('/teams',[auth,admin], async (req, res) => {
  //  isAdmin(req,res)
    const team = new Team(req.body)
   try {
        await team.save()
        res.status(201).send({'Status':'Success','Description':'Team Successfully Created'})
   } catch(e) {
        res.status(400).send({'Status':'Error','Description':e})
    }

})

router.get('/teams',auth, async (req,res) => {
    const teamsRedisKey = 'teams';
     client.get(teamsRedisKey, async (err, teams) => {
        if (teams) {
            return res.send({'Status':'Success','Description':'Teams Successfully Fetched','Teams':JSON.parse(teams)})
        } 
        else {
            try {
            const teams = await Team.find({},['fullName','teamCode'])
            if (teams.length == 0) {
                return res.status(404).send({'Status':'Error','Description':'No Record Found'})
            }    
            client.setex(teamsRedisKey, 3600,JSON.stringify(teams))
            res.send({'Status':'Success','Description':'Teams Successfully Fetched','Teams':teams})
            } catch(e){
                res.status(500).send({'Status':'Error','Description':e})
            } 
        }
    })
})

router.get('/teams/:id',auth,async (req, res) => {
    const id = req.params.id
    const teamsIndRedisKey = 'teams'+id;
    client.get(teamsIndRedisKey, async (err, team) => {   
        if (team) {
            return res.send({'Status':'Success','Description':'Team Successfully Fetched','Team':JSON.parse(team)})
        } 
        else {
            try {
                const team = await Team.findById(id,['fullName','teamCode'])
                if (!team) {
                    return res.status(404).send({'Status':'Error','Description':'No Record Found'})
                }
                client.setex(teamsIndRedisKey, 3600,JSON.stringify(team))
                res.send({'Status':'Success','Description':'Team Successfully Fetched','Team':team})
            } catch(e) {
                res.status(500).send({'Status':'Error','Description':e})
            }
        }
    })
})

router.patch('/teams/:id',[auth,admin],async (req, res) => {
   // isAdmin(req,res)
    const id = req.params.id
    const updates = Object.keys(req.body)
    const allowedFields = ['fullName','teamCode']
    const isValidField = updates.every((update)=> allowedFields.includes(update))
    if(!isValidField) {
        return res.status(400).send({'Status':'Error','Description': 'Please Ensure Field Only Existing Fields are Updated'})
    }
    try {
        const team = await Team.findByIdAndUpdate(id,req.body, {new:true, runValidators: true})
        if (!team) {
            return res.status(404).send({'Status':'Error','Description':'No Record Found'})
        }
        res.send({'Status':'Success','Description':'Team Successfully Updated'})
      } catch(e) {
          res.status(500).send({'Status':'Error','Description':e})
      }
})

router.delete('/teams/:id',[auth,admin],async (req, res) => {
  // isAdmin(req,res)
    const id = req.params.id
    try {
        const team = await Team.findByIdAndDelete(id,['fullName','teamCode'])
        if (!team) {
            return res.status(404).send({'Status':'Error','Description':'No Record Found'})
        }
        res.send({'Status':'Success','Description':'Team Successfully Deleted'})
      } catch(e) {
          res.status(500).send({'Status':'Error','Description':e})
      }
})

router.post('/teams/search',async (req, res) => {
    // isAdmin(req,res)
    const searchParams = Object.keys(req.body)
     if (searchParams.length == 0){
        return res.status(403).send({'Status':'Error','Description':'Please Pass A Search Parameter'})
     }
     const allowedFields = ['fullName','teamCode']
    const isValidField = searchParams.every((searchParam)=> allowedFields.includes(searchParam))
    if(!isValidField) {
        return res.status(400).send({'Status':'Error','Description': 'Please Ensure Field Only Existing Fields are Updated'})
    }
     const searchVariable = {};
     searchParams.forEach((searchParam)=>{
        searchVariable[searchParam] = req.body[searchParam]
     })
      try {
          const team = await Team.find(searchVariable,['fullName','teamCode'])
          if (team.length == 0) {
              return res.status(404).send({'Status':'Error','Description':'Search Returns No Record'})
          }
          res.send({'Status':'Success','Description':'Team Successfully Fetched','Team':team})
        } catch(e) {
            res.status(500).send({'Status':'Error','Description':e})
        }
  })


module.exports = router