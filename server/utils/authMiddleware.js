const jwt = require("jsonwebtoken");
const secretKey = require("../configs/jwt");

function authenticateToken(req, res, next) {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer" || !token) {
        return res.status(401).json({ message: "Invalid token" });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token is invalid" });
        }
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };