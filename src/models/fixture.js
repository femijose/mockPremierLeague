const mongoose = require('mongoose')
const validator = require('validator')
const Team = require('./team')

const fixtureSchema = new mongoose.Schema({
        homeTeam: {
        type: String,
        minlength: 2,
        maxlength: 6,
        uppercase: true,
        trim: true,
        required: true
        },
        awayTeam: {
         type: String,
         minlength: 2,
         maxlength: 6,
         uppercase: true,
         trim: true,
         required: true,
        },
       fixtureDate: {
        type: Date,
        required: true,
        trim:true,
        },
        homeTeamScore: {
        type: Number,
        },
        awayTeamScore: {
            type: Number,  
        },
        fixtureLink: {
            type: String,
            trim: true,
        },
        completed: {
            type: Boolean,
            default: false,
            trim: true
        }
    
})

/* fixtureSchema.pre('save', async function (res,next) {
    const fixture = this

    const homeTeam = await Team.findOne({'teamCode':fixture.homeTeam})
    const awayTeam = await Team.findOne({'teamCode':fixture.awayTeam})
    if(!homeTeam) {
        //throw new Error('Home Team Does Not Exist. Please Use A Registered Team')
        return res.status(401).send({'Status':'Error','Description':'Home Team Does Not Exist. Please Use A Registered Team'})
    }
    if(!awayTeam) {
        //throw new Error('Away Team Does Not Exist. Please Use A Registered Team')
        return res.status(401).send({'Status':'Error','Description':'Away Team Does Not Exist. Please Use A Registered Team'})
    } 

    next()
}) */

const Fixture = mongoose.model('Fixture',fixtureSchema)

module.exports = Fixture