const rateLimit = require("express-rate-limit");

const limiter = {
    login: rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 5,
        message: {
            status: 429,
            error: "So much requests for login. Try again after 15 minutes"
        }
    }),
    global: rateLimit({
        windowMs: 60 * 60 * 1000,
        max: 100,
        message: {
            status: 429,
            error: "So much requests for site. Try again after 1 hour"
        }
    })
}

module.exports = limiter;