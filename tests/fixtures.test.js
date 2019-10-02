const request = require('supertest')
const app = require('../src/app')
const Fixture = require('../src/models/fixture')
const { adminUserId,adminUser,testUserId,testUser, testTeam, testFixture,setupDatabase } = require('./testdata.js')

beforeEach(setupDatabase) 

//create fixture by admin
test('Perform Fixture Creation', async () => {
    const response = await request(app)
    .post('/fixtures')
    .set('Authorization', `Bearer ${adminUser.tokens[0].token}`)
    .send({
         homeTeam: "UI",
         awayTeam :"UNICAL",
	     fixtureDate :"2019-02-03",
    }).expect(201)

    // Assert that the database was changed correctly
    const fixture = await Fixture.find({'homeTeam':'UI','awayTeam':'UNICAL'})
    expect(fixture).not.toBeNull()
})

//create fixture by non admin
test('Perform fixture Creation By Non Admin', async () => {
    const response = await request(app)
    .post('/fixtures')
    .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
    .send({
        homeTeam: "OAU",
        awayTeam :"UNIBEN",
        fixtureDate :"2019-02-03",
    }).expect(401)

    // Assert that the database was changed correctly
    const fixture = await Fixture.findOne({'homeTeam':'OAU','awayTeam':'UNIBEN'})
    expect(fixture).toBeNull
})

//get Fixtures
test('Should fetch all fixtures', async () => {
    const response = await request(app)
        .get('/fixtures')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)
   
})
//get fetch fixture details
test('Should fetch a particular fixture', async () => {
    const response = await request(app)
        .get('/fixtures/'+testFixture._id)
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)     
        expect(response.body.Fixture.homeTeam).toBe(testFixture.homeTeam)
})

//update fixture
test('Update fixtures by Non Admin User', async () => {
    const response = await request(app)
        .patch('/fixtures/'+testFixture._id)
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send({
            completed: 'true'
        })
        .expect(401)     
})

test('Update fixture by  Admin User', async () => {
    const response = await request(app)
        .patch('/fixtures/'+testFixture._id)
        .set('Authorization', `Bearer ${adminUser.tokens[0].token}`)
        .send({
            completed: 'true'
        })
        .expect(200)  
        const fixture = await Fixture.findById(testFixture._id)
        expect(fixture.completed).toBe(true)   
})

test('Update Non existing field of fixtures by  Admin User', async () => {
    const response = await request(app)
        .patch('/fixtures/'+testFixture._id)
        .set('Authorization', `Bearer ${adminUser.tokens[0].token}`)
        .send({
            teamAddress: 'UOA'
        })
        .expect(400)   
})


//delete
test('Delete fixtures By Non - Admin User', async () => {
    const response = await request(app)
        .delete('/fixtures/'+testFixture._id)
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(401)
    const fixture = await Fixture.findById(testFixture._id)
    expect(fixture).not.toBeNull()
})

test('Delete fixtures By Admin User', async () => {
    const response = await request(app)
        .delete('/fixtures/'+testFixture._id)
        .set('Authorization', `Bearer ${adminUser.tokens[0].token}`)
        .send()
        .expect(200)
    const fixture = await Fixture.findById(testFixture._id)
    expect(fixture).toBeNull()
})