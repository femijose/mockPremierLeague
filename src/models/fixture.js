const mongoose = require('mongoose')
const validator = require('validator')

const Fixture = mongoose.model('Fixture', {
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
     required: true
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

module.exports = Fixture