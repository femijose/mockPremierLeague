const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { adminUserId,adminUser,testUserId,testUser, testTeam, testFixture,setupDatabase } = require('./testdata.js')

beforeEach(setupDatabase)

test('Perform User Sign Up', async () => {
    const response = await request(app).post('/users').send({
        username: 'Opeyemi',
        password: '&&Opeyemi!'
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findOne({'username':'Opeyemi'})
    expect(user).not.toBeNull()

   
   //Assert that password is not saved in plain text 
    expect(user.password).not.toBe('&&Opeyemi!')
})


test('Perform Admin User Sign Up', async () => {
    const response = await request(app).post('/users').send({
        username: 'fikayo',
        password: 'fikayo',
        admin:true,
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findOne({'username':'fikayo'})
    expect(user).not.toBeNull()

   //Assert that password is not saved in plain text 
    expect(user.password).not.toBe('fikayo')
    expect(user.admin).toBe(true)
})

test('Perform log in For existing user', async () => {
    const response = await request(app).post('/users/login').send({
        username: testUser.username,
        password: testUser.password
    }).expect(200)
    const user = await User.findById(testUserId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Perform log in For existing admin user', async () => {
    const response = await request(app).post('/users/login').send({
        username: adminUser.username,
        password: adminUser.password
    }).expect(200)
    const user = await User.findById(adminUserId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Attempt to login in with invalid detils', async () => {
    await request(app).post('/users/login').send({
        username: testUser.username,
        password: 'usingwrongpassword'
    }).expect(400)
})
