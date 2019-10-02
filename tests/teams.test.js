const request = require('supertest')
const app = require('../src/app')
const Team = require('../src/models/team')
const { adminUserId,adminUser,testUserId,testUser, testTeam, testFixture,setupDatabase } = require('./testdata.js')

beforeEach(setupDatabase) 

//createteam by admin
test('Perform team Creation', async () => {
    const response = await request(app)
    .post('/teams')
    .set('Authorization', `Bearer ${adminUser.tokens[0].token}`)
    .send({
        fullName: 'University of Ibadan',
        teamCode: 'UI!'
    }).expect(201)

    // Assert that the database was changed correctly
    const team = await Team.find({'teamCode':'UI'})
    expect(team).not.toBeNull()
})

//create team by non admin
test('Perform team Creation By Non Admin', async () => {
    const response = await request(app)
    .post('/teams')
    .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
    .send({
        fullName: 'University of Ibadan',
        teamCode: 'UI'
    }).expect(401)

    // Assert that the database was changed correctly
    const team = await Team.findOne({'teamCode':'UI'})
    expect(team).toBeNull
})

//getteam
test('Should fetch teams', async () => {
    const response = await request(app)
        .get('/teams')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)
   
})
//get created team details
test('Should fetch a particular team', async () => {
    const response = await request(app)
        .get('/teams/'+testTeam._id)
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)     
        expect(response.body.Team.teamCode).toBe(testTeam.teamCode)
})

//update team
test('Update team by Non Admin User', async () => {
    const response = await request(app)
        .patch('/teams/'+testTeam._id)
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send({
            teamCode: 'UOA'
        })
        .expect(401)     
})

test('Update team by  Admin User', async () => {
    const response = await request(app)
        .patch('/teams/'+testTeam._id)
        .set('Authorization', `Bearer ${adminUser.tokens[0].token}`)
        .send({
            teamCode: 'UOA'
        })
        .expect(200)  
        const team = await Team.findById(testTeam._id)
        expect(team.teamCode).toBe('UOA')   
})

test('Update Non existing field of team by  Admin User', async () => {
    const response = await request(app)
        .patch('/teams/'+testTeam._id)
        .set('Authorization', `Bearer ${adminUser.tokens[0].token}`)
        .send({
            teamAddress: 'UOA'
        })
        .expect(400)   
})


//delete
test('Delete Team By Non - Admin User', async () => {
    const response = await request(app)
        .delete('/teams/'+testTeam._id)
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(401)
    const team = await Team.findById(testTeam._id)
    expect(team).not.toBeNull()
})

test('Delete Team By Admin User', async () => {
    const response = await request(app)
        .delete('/teams/'+testTeam._id)
        .set('Authorization', `Bearer ${adminUser.tokens[0].token}`)
        .send()
        .expect(200)
    const team = await Team.findById(testTeam._id)
    expect(team).toBeNull()
})