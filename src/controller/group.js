const connection = require("../config/database.js");
const member = require("../controller/member.js");
const jwt = require("jsonwebtoken");

const group = {
    create: async (req, res) => {
        //getting data
        const email = req.token.sub;
        if(!email) {
            return res.status(400).json({error: "Email not identified in token subject"});
        };

        const {name} = req?.body;
        const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ'\s-]{2,50}$/;
        if(!regex.test(name)) {
            return res.status(400).json({error: "Invalid group's name"});
        };

        //business logic
        const isolatedConnection = await connection.getConnection();
        await isolatedConnection.beginTransaction();

        try {
            //creating a new group and a leader
            const queryInsertGroups = `
            INSERT INTO \`groups\` (id, name) 
            VALUES (DEFAULT, ?);
            `;
            const [rowInsert] = await isolatedConnection.execute(queryInsertGroups, [name || null]);
            
            const queryInsertGroupsMembers = `
            INSERT INTO \`groups_members\` (group_id, member, role_in_the_group)
            VALUES (?, ?, ?);
            `;
            await isolatedConnection.execute(queryInsertGroupsMembers, [rowInsert.insertId, email, "leader"]);
            isolatedConnection.commit();

            //members...
            const {members} = req?.body;

            if(members) {
                req.params.group_id = rowInsert.insertId;
                await member.addMembers(req, res);
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
    delete: async (req, res) => {
        const {group_id} = req?.params;
        if(!group_id) {
            return res.status(400).json({error: "Undefined group_id"});
        };

        try {
            const queryDelete = `
            DELETE FROM \`groups_members\`
            WHERE group_id = ?;
            `;
            await connection.execute(queryDelete, [group_id]);

            return res.status(200).json({body: {group_id: group_id}, message: "Group deleted suceffuly"});
        } catch (err) {
            console.error(err);
            return res.status(500).json({error: "Server error"});
        }
    }
};

module.exports = group;