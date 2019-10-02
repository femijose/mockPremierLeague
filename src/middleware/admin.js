const isAdmin = (req,res,next) => {
    if(!req.user.admin) {
      res.status(401).send({'Status':'Error', 'Description': 'Admin Access Required To Perform This Request'})
    } else {
        next()
    }
  } 
  
  module.exports = isAdmin