const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(401).send("unautorized request");
    }
    try {
        token = token.split(' ')[1];

        if (token === null || !token) {
            return res.status(401).send("unauthorized request")
        }

        let verifyUser = jwt.verify(token, 'rinaldy97');
        if (!verifyUser) {
            return res.status(401).send("unauthorized request")
        }
        req.user = verifyUser;
        next();

    } catch (err) {
        res.status.send("invalid token");
    }
}
module.exports = {
    verifyToken,
}