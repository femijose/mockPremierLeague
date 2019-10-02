const mongoose = require('mongoose')

mongoose.connect('mongodb://'+process.env.MONGODB_HOST+':'+process.env.MONGODB_PORT+'/'+process.env.MONGODB_NAME,{
    useNewURLParser: true,
    useCreateIndex: true
})


