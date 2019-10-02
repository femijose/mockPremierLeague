/*const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient */

const {MongoClient,ObjectID} = require('mongodb')


const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'mockPremierLeague'


const id = new ObjectID()
console.log(id)
console.log(id.getTimestamp)
MongoClient.connect(connectionURL,{useNewURLParser: true},(error, client) => {
 if(error) {
     return console.log('Unable to connect to database!')
 }

 const db = client.db(databaseName)

 // insert one
 /* db.collection('users').insertOne({
     name: 'Femi',
     age: 30
 },(error, result)=>{
    if(error) {
        return console.log('Unable to insert user')
    }

    console.log(result.insertedId)

 }) */

 // Insert Many
 /*db.collection('user').insertMany([
     {
       name: 'Tayo',
       age: 27
     },
     {
       name: 'Gunner',
       age: 23

     }
 ], (error, result) => {
    if(error) {
        return console.log('Unable to insert user')
    }

    console.log(result.insertedIds)
 }

 ) */

 // Read from database

 /*db.collection('user').findOne({name: 'Tayo'},(error,user)=> {
    if(error) {
        return console.log('Unable to fetch user')
    }
    console.log(user)
 })

 db.collection('user').findOne({_id: new ObjectID("5d8fdd1ffc1a3200f535de00")},(error,user)=> {
    if(error) {
        return console.log('Unable to fetch user')
    }
    console.log(user)
 })

 db.collection('user').find({name: 'Tayo'}).toArray( //find returns a cursor
     (error,users) => { 
        console.log(users)
     }
 )

 db.collection('user').find({name: 'Tayo'}).toArray( //find returns a cursor
    (error,users) => { 
       console.log(users)
    }
)

db.collection('user').find({name: 'Tayo'}).count( //find returns a cursor
    (error,counts) => { 
       console.log(counts)
    }
) */

//update

/* db.collection('user').updateOne({
    _id: new ObjectID("5d8fdd1ffc1a3200f535de00")
},{
    $set: {
        name:'Joshua'
    }
}).then((result)=> {
 console.log(result)
}).catch((error)=> {
console.log(error)
}) */

db.collection('user').deleteOne({
_id: new ObjectID("5d8fdd1ffc1a3200f535de00")
}).then((result)=>{
console.log(result)
}).catch(()=>{
console.log(error)
})

})