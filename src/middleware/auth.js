const jwt = require("jsonwebtoken");

const auth = {
    verify: {
        token: async (req, res, next) => {
            const token = req.cookies.auth_token;
            if(!token) {
                return res.status(401).json({error: "Token not found"});
            };
    
            try {
                const verified = jwt.verify(token, process.env.JWT_KEY, {"algorithms": ["HS256"]});
                
                if(verified.type != "access") {
                    return res.status(401).json({error: "Invalid token type"});
                };
    
                req.token = verified;
                next();
            } catch (err) {
                return res.status(401).json({error: "Token expired or invalid"});
            }
        },
        refreshToken: async (req, res, next) => {
            //modelo apátrido
            const refresh_token = req?.cookies?.refresh_token;
            if(!refresh_token) {
                return res.status(401).json({error: "Refresh token not found"});
            };
    
            try {
                //verifying
                const verified = jwt.verify(refresh_token, process.env.JWT_REFRESH_KEY, {"algorithms": ["HS256"]});
                if(!verified?.type || verified.type != "refresh") {
                    return res.status(401).json({error: "Invalid token type"});
                };
                
                const payload = {
                    sub: verified.sub,
                    role: verified.role
                };
                
                const newAcesstoken = auth.generate.token(payload, res);
                req.token = newAcesstoken;
                return res.status(201).json({message: "New acess token generated"});
            } catch (err) {
                return res.status(401).json({error: "Token expired or invalid"})
            }
        }
    },
    generate: {
        token: (payload, res) => {
            const token = jwt.sign({...payload, type: "access"}, process.env.JWT_KEY, {"expiresIn": "15m", "algorithm": "HS256"});
            res.cookie("auth_token", token, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 15 * 60 * 1000,
                path: "/api"
            });
    
            const refresh_token = jwt.sign({...payload, type: "refresh"}, process.env.JWT_REFRESH_KEY, {"expiresIn": "7d", "algorithm": "HS256",});
            res.cookie("refresh_token", refresh_token, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: "/auth/refresh"
            });

            return {token: token};
        }
    }
}

module.exports = auth;