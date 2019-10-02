const mongoose = require('mongoose')
const validator = require('validator')

const Team = mongoose.model('Team', {
    fullName: {
    type: String,
    required: true,
    trim:true,
    unique: true,
    },
    teamCode: {
     type: String,
     minlength: 2,
     maxlenght: 6,
     uppercase: true,
     trim: true,
     unique: true,
     required: true,
    }

})

module.exports = Team