const connection = require("../config/database.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const user = {
    signUp: async (req, res) => {
        const {userObj} = req.body;

        //validation
        if(!userObj) {
            return res.status(400).json({error: "userObj not found"});
        }

        try {
            const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            const regexNome = /^[A-Za-zÀ-ÖØ-öø-ÿ'\s-]{2,50}$/

            if(!regexEmail.test(userObj.email) || !regexNome.test(userObj.name)) {
                return res.status(400).json({body: userObj, error: "Invalid datas"});
            }

            const querySelect = `
            SELECT email
            FROM users
            WHERE email = ?;
            `;
            const [rows] = await connection.execute(querySelect, [userObj.email]);
            if(rows.length != 0) {
                return res.status(400).json({body: userObj, error: "This email alredy be registered"});
            }
            
            //insertion
            const hash = await bcrypt.hash(userObj.password, 10);
            const queryInsert = `
            INSERT INTO users (email, name, role, password)
            VALUES (?, ?, ?, ?);
            `;
            await connection.execute(queryInsert, [userObj.email, userObj.name, "user", hash]);
            return res.status(201).json({body: userObj, message: "User registered sucefully"});
        } catch (err) {
            console.error(err);
            return res.status(400).json({error: "Server error"});
        }
    },
    login: async (req, res) => {
        const {userObj} = req.body;

        //validation
        if(!userObj) {
            return res.status(400).json({error: "userObj not found"});
        }

        try {
            const query = `
            SELECT email, role, password
            FROM users
            WHERE email = ?;
            `;

            const [rows] = await connection.execute(query, [userObj.email]);

            if(rows.length === 0) {
                return res.status(400).json({body:userObj, error: "User undefined"});
            }
            if(!await bcrypt.compare(userObj.password, rows[0].password)) {
                return res.status(400).json({body: userObj, error: "Wrong password"});
            }

            //JWT
            payload = {
                sub: rows[0].email,
                role: rows[0].role
            }
            const token = jwt.sign(payload, process.env.JWT_KEY, {"expiresIn": "1hr", "algorithm": "HS256"});
            res.cookie("auth_token", token, {
                httpsOnly: true,
                sameSite: "strict",
                maxAge: 360000,
                path: "/api"
            })

            return res.status(200).json({body: userObj, message: "User sucefully logged in"});
        } catch (err) {
            console.error(err);
            return res.status(500).json({error: "Server error"});
        }
    },
    getUsers: async (req,res) => {
        try {
            const [rows] = await connection.execute(`
                SELECT email, name
                FROM users;
                `);

            return res.status(200).json({body: rows});
        } catch (err) {
            console.error(err);
            return res.status(500).json({error: "Server error"});
        }
    },
    getGroups: async (req, res) => {
        const email = req?.token?.sub;
        if(!email) {
            return res.status(400).json({error: "Undefined email"});
        };

        const query = `
        SELECT \`groups\`.id, \`groups\`.name, \`groups_members\`.role_in_the_group
        FROM \`groups\` 
            INNER JOIN \`groups_members\`
            ON \`groups\`.id = \`groups_members\`.group_id
        WHERE \`groups_members\`.member = ?;
        `;

        try {
            const [rows] = await connection.execute(query, [email]);
            return res.status(200).json({body: rows});
        } catch (err) {
            console.error(err);
            return res.status(500).json({error: "Server error"});
        }
    }
}

module.exports = user;
