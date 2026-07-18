const jwt = require("jsonwebtoken");

const tokenVerify = async (req, res, next) => {
    const token = req.cookies.auth_token;

    if(!token) {
        return res.status(401).json({error: "Token not found"});
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_KEY, {"algorithms": ["HS256"]});

        req.token = verified;

        next();
    } catch (err) {
        return res.status(401).json({error: "Token expired or invalid"});
    }
}

module.exports = tokenVerify;