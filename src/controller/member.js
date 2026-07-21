const connection = require("../config/database.js");

const member = {
    addMembers: async (req, res) => {
        //getting data and verifying if members arrived with correct data type
        const {members} = req?.body;
        if(!members || !Array.isArray(members) || !members.length > 0) {
            return res.status(400).json({body: [{members: members}, {group_id: group_id}], error: "Invalid members data"});
        };

        const {group_id} = req?.params;
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
                let [rowSelect] = await isolatedConnection.execute(querySelect, [members[i].member]);

                //if rowSelect does not returns a row...
                if(rowSelect.length === 0) {
                    return res.status(400).json({body: members, error: `${members[i].member} not identified`});
                };

                //verifying the roles inputeds in members object
                if(!validRoles.includes(members[i].role_in_the_group)) {
                    return res.status(400).json({body: members, error: `${members[i].member} role_in_the_group's undefined`});
                }

                //inputting in the database
                await isolatedConnection.execute(queryInsert, [group_id, members[i].member, members[i].role_in_the_group]);
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
    },
    removeMembers: async (req, res) => {
        //getting and validating data
        const email = req?.token?.sub;
        if(!email) {
            return res.status(400).json({error: "Undefined email"});
        }

        const {group_id} = req?.params;
        if(!group_id) {
            return res.status(400).json({error: "Undefined group_id"});
        }

        //getting members of this group
        const queryGroupMembers = `
        SELECT *
        FROM \`groups_members\`
        WHERE group_id = ? AND role_in_the_group <> "leader";
        `;
        const [rowsGroupMembers] = await connection.execute(queryGroupMembers, [group_id]);

        //getting and validating data
        const {removeMembers} = req?.body;
        if(!removeMembers) {
            return res.status(400).json({body: removeMembers, error: "Undefined members for delete"});
        };

        //transaction
        const isolatedConnection = await connection.getConnection();
        await isolatedConnection.beginTransaction();
        try {
            //removing
            const queryRemove = `
            DELETE FROM \`groups_members\`
            WHERE member = ?;
            `;
            
            for(let i = 0; i < removeMembers.length; i++) {
                if(rowsGroupMembers.some(member => member.member === removeMembers[i].member)) {
                    await isolatedConnection.execute(queryRemove, [removeMembers[i].member]);
                } else {
                    isolatedConnection.rollback();
                    return res.status(400).json({body: removeMembers, error: `${removeMembers[i].member} not identified`});
                }
            }
            isolatedConnection.commit();
            return res.status(200).json({body: removeMembers, message: "members removed"});
        } catch (err) {
            isolatedConnection.rollback();
            console.error(err);
            return res.status(500).json({error: "Server error"});
        } finally {
            isolatedConnection.release();
        }
    },
    getMembers: async (req, res) => {
        const {group_id} = req?.params;
        if(!group_id) {
            return res.status(400).json({error: "Undefined group_id"});
        }

        try {
            const query = `
                SELECT *
                FROM \`groups_members\`
                WHERE group_id = ?;
                `;
            const [members] = await connection.execute(query, [group_id]);

            return res.status(200).json({body: members, message: "Members getted suceffuly"});
        } catch (err) {
            console.error(err);
            return res.status(500).json({error: "Server error"});
        }
    }
}

module.exports = member;