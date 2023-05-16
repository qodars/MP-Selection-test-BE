const jwt = require("jsonwebtoken")

module.exports ={
    newver:(req, res, next) =>{
        jwt.verify(req.token, "qodars97", (err, decode)=>{
            if (err) {
                return res.send(401).send("user not auth")
            }
            req.user = decode

            next()
        })
    }
}