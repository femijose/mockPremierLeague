const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../src/models/user')
const Team = require('../src/models/team')
const Fixture = require('../src/models/fixture')


const testUserId = new mongoose.Types.ObjectId()
const testUser = {
    _id: testUserId,
    username: 'nsemkpang',
    password: '&&nsemkpang',
    tokens: [{
        token: jwt.sign({ _id: testUserId }, process.env.JWT_TOKEN_SECRET)
    }]
}

const adminUserId = new mongoose.Types.ObjectId()
const adminUser = {
    _id: adminUserId,
    username: 'femijose',
    password: 'femijose',
    admin: true,
    tokens: [{
        token: jwt.sign({ _id: adminUserId }, process.env.JWT_TOKEN_SECRET)
    }]
}

const testUserId2 = new mongoose.Types.ObjectId()
const testUser2 = {
    _id: testUserId2,
    username: 'nsemkpang1',
    password: 'nsemkpang',
    tokens: [{
        token: jwt.sign({ _id: testUserId2 }, process.env.JWT_TOKEN_SECRET)
    }]
}


const testTeam = {
    _id: new mongoose.Types.ObjectId(),
    fullName: 'Obafemi Awolowo University',
    teamCode: 'OAU',
}



const testFixture = {
    _id: new mongoose.Types.ObjectId(),
    homeTeam: 'OAU',
    awayTeam: 'UI',
	fixtureDate:"2019-02-03",
    homeTeamScore: "",
    awayTeamScore:"",
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Team.deleteMany()
    await Fixture.deleteMany()
    await new User(testUser).save()
    await new User(adminUser).save()
    await new User(testUser2).save()
    await new Team(testTeam).save()
    await new Fixture(testFixture).save()
}

module.exports = {
    adminUserId,
    adminUser,
    testUser2,
    testUserId2,
    testUserId,
    testUser,
    testTeam,
    testFixture,
    setupDatabase
}