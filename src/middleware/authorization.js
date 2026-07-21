const connection = require("../config/database.js");
const member = require("../controller/member.js");

const authorization = {
    leader: async (req, res, next) => {
        //getting the user email
        const email = req?.token?.sub;
        if(!email) {
            return res.status(400).json({error: "Undefined email"});
        }

        const {group_id} = req?.params;
        if(!group_id) {
            return res.status(400).json({error: "Undefined group_id"});
        };

        try {
            const query = `
            SELECT *
            FROM \`groups_members\`
            WHERE group_id = ? AND member = ? AND role_in_the_group = "leader";
            `;

            const [row] = await connection.execute(query, [group_id, email]);
            if(row.length === 0) {
                return res.status(403).json({body: email, error: "You don't have permission to do this"});
            }

            next();
        } catch (err) {
            console.error(err);
            return res.status(500).json({error: "Server error"});
        }
    },
    subLeader: async (req, res, next) => {
        //getting the user email
        const email = req?.token?.sub;
        if(!email) {
            return res.status(400).json({error: "Undefined email"});
        };

        const {group_id} = req?.params;
        if(!group_id) {
            return res.status(400).json({error: "Undefined group_id"});
        };

        try {
            const query = `
            SELECT *
            FROM \`groups_members\`
            WHERE group_id = ? AND member = ? AND role_in_the_group <> "member";
            `;

            const [row] = await connection.execute(query, [group_id, email]);
            if(row.length === 0) {
                return res.status(403).json({body: email, error: "You don't have permission to do this"});
            }

            next();
        } catch (err) {
            console.error(err);
            return res.status(500).json({error: "Server error"});
        }
    },
    member: async (req, res, next) => {
        const email = req?.token?.sub;
        if(!email) {
            return res.status(400).json({error: "Undefined email"});
        };

        const {group_id} = req?.params;
        if(!group_id) {
            return res.status(400).json({error: "Undefined group_id"});
        }

        try {
            const query = `
            SELECT member
            FROM \`groups_members\`
            WHERE group_id = ? AND member = ?;
            `;
    
            const [row] = await connection.execute(query, [group_id, email]);
            if(row.length === 0) {
                return res.status(403).json({body: email, error: "You aren't group's member"});
            }
    
            next();
        } catch (err) {
            console.error(err);
            return res.status(500).json({error: "Server error"});
        }
    }
};

module.exports = authorization;