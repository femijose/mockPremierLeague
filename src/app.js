const express = require('express')
require('./db/mongoose')
const teamRouter = require('./routers/team')
const fixtureRouter = require('./routers/fixture')
const userRouter = require('./routers/user')
const rateLimiter = require('./middleware/ratelimiter')
const session = require('express-session')
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL, {no_ready_check: true})
const redisStore = require('connect-redis')(session);

const app = express()

/*app.use(session({
    secret: process.env.REDIS_SESSION_SECRET,
    name: process.env.REDIS_SESSION_NAME,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, 
    store: new redisStore({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT, client: client, ttl: process.env.REDIS_TTL }),
  })) */
  app.use(
    session({
      store: new redisStore({ client }),
      secret: process.env.REDIS_SESSION_SECRET,
      name: process.env.REDIS_SESSION_NAME,
      resave: false,
      saveUninitialized: true,
    cookie: { secure: false }, 
    })
  )
app.use(express.json())
app.use(rateLimiter)
app.use(teamRouter)
app.use(fixtureRouter)
app.use(userRouter)


module.exports = app




