const connection = require("../config/database.js");
const jwt = require("jsonwebtoken");

const group = {
    newGroup: async (req, res) => {
        //getting data
        const email = req.token.sub;
        if(!email) {
            return res.status(400).json({error: "Email not identified in token subject"});
        };

        //business logic
        const isolatedConnection = await connection.getConnection();
        await isolatedConnection.beginTransaction();

        try {
            //creating a new group and a leader
            const [rowInsert] = await isolatedConnection.execute("INSERT INTO `groups` (id) VALUES (DEFAULT);");
            const queryInsert = `
            INSERT INTO groups_members (group_id, member, role_in_the_group)
            VALUES (?, ?, ?);
            `;
            await isolatedConnection.execute(queryInsert, [rowInsert.insertId, email, "leader"]);
            isolatedConnection.commit();

            //members...
            const {members} = req?.body;

            if(members) {
                req.body.group_id = rowInsert.insertId;
                await group.addMembers(req, res);
            } else {
                return res.status(201).json({message: `Group #${rowInsert.insertId} created`});
            }
        } catch (err) {
            isolatedConnection.rollback();
            console.error(err);
            return res.status(500).json({error: "Server error"});
        } finally {
            isolatedConnection.release();
        }
    },
    addMembers: async (req, res) => {
        //getting data
        const {members, group_id} = req.body;
        
        //verifying if members arrived with correct data type
        if(!members || !Array.isArray(members) || !members.length > 0) {
            return res.status(400).json({body: [{members: members}, {group_id: group_id}], error: "Invalid members data"});
        };

        if(!group_id || isNaN(group_id)) {
            return res.status(400).json({body: [{members: members}, {group_id: group_id}], error: "Invalid group_id data"});
        };

        //query for verify if have the user email in the database
        const querySelect = `
        SELECT email
        FROM users
        WHERE email = ?;
        `;

        //query for input the member in the group
        const queryInsert = `
        INSERT INTO groups_members (group_id, member, role_in_the_group)
        VALUES (?, ?, ?);
        `;

        const isolatedConnection = await connection.getConnection();
        await isolatedConnection.beginTransaction();

        
        try {
            let validRoles = ["leader", "sub-leader", "member"];
            for(let i = 0; i < members.length; i++) {
                //veriffying every member in the database
                let [rowSelect] = await isolatedConnection.execute(querySelect, [members[i].email]);

                //if rowSelect does not returns a row...
                if(rowSelect.length === 0) {
                    return res.status(400).json({body: members, error: `${members[i].email} not identified`});
                };

                //verifying the roles inputeds in members object
                if(!validRoles.includes(members[i].role_in_the_group)) {
                    return res.status(400).json({body: members, error: `${members[i].email} role_in_the_group's undefined`});
                }

                //inputting in the database
                await isolatedConnection.execute(queryInsert, [group_id, members[i].email, members[i].role_in_the_group]);
            }
            isolatedConnection.commit();
            return res.status(201).json({body: [{group_id: group_id}, {members: members}], message: "Members added successfully"});
        } catch (err) {
            isolatedConnection.rollback();
            console.error(err);
            return res.status(500).json({error: "Server error"});
        } finally {
            isolatedConnection.release();
        }
    }
}

module.exports = group;