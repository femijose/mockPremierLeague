var RateLimiter = require('limiter').RateLimiter
var limiter = new RateLimiter(process.env.API_RATE_LIMIT, 'hour',true)

const rateLimiter = (req,res,next) => {
    limiter.removeTokens(1, function(err, remainingRequests) {
        if (remainingRequests < 1) {
          res.status(429).send({'Status':'Error','Description':'Too Many Requests - your API call rate limit is reached'})
        } else {
        next()
        }
      })
}

module.exports = rateLimiter