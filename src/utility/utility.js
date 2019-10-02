const isAdmin = (req,res) => {
  if(!req.user.admin) {
    res.status(401).send({'Status':'Error', 'Description': 'Admin Access Required To Perform This Request'})
  }
} 

module.exports = isAdmin