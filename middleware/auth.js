const jwt = require('jsonwebtoken')

const auth = (req,res,next) => {
    try{
        const token = req.header('x-auth-token')
        if(!token){
            res.status(401).json({message:"No auth token"})
        }
        const verified = jwt.verify(token,process.env.jwt)
        if (!verified){
            res.status(403).json({message:"wrong token"})
        }
        req.user = verified.id
        next()

    }catch (err) {
        res.status(500).json({message:err.message})
    }
}

module.exports = auth