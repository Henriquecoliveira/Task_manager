const connection = require("../config/database.js");

const task = {
    create: async (req, res) => {
        //getting data
        const email = req?.token?.sub;
        if(!email) {
            return res.status(400).json({error: "Undefined email"});
        };

        const {taskObj} = req?.body;
        if(!taskObj) {
            return res.status(400).json({error: "Undefined taskObj"});
        }

        const {group_id} = req?.params;
        if(!group_id || isNaN(group_id)) {
            return res.status(400).json({error: "Undefined group_id"});
        };

        //vallidating data
        const regexTitle = /^[A-Za-zÀ-ÖØ-öø-ÿ'\s-]{1,50}$/;
        if(!taskObj?.title || !regexTitle.test(taskObj?.title)) {
            return res.status(400).json({body: taskObj, error: "Invalid title"});
        };
        
        const regexDescription = /^[A-Za-zÀ-ÖØ-öø-ÿ'\s-]{1,255}$/;
        if(taskObj?.description && !regexDescription.test(taskObj.description)) {
            return res.status(400).json({body: taskObj, error: "Invalid description"});
        };

        try {
            const queryGroup = `
            SELECT *
            FROM \`groups\`
            WHERE id = ?;
            `;

            const [rowGroup] = await connection.execute(queryGroup, [group_id]);
            if(rowGroup.length === 0) {
            return res.status(400).json({body: taskObj, error: "Group not identified"});
            }
    
            const queryCreateTask = `
            INSERT INTO tasks (id, title, description, group_id, register_date, author_email, status)
            VALUES (DEFAULT, ?, ?, ?, DEFAULT, ?, "Incomplete");
            `;
            const [rowTask] = await connection.execute(queryCreateTask, [taskObj.title, taskObj?.description || null, group_id, email]);
            return res.status(201).json({body: taskObj, message: `Task #${rowTask.insertId} created`});
        } catch (err) {
            console.error(err);
            return res.status(500).json({error: "Server error"});
        }
    },
    delete: async (req, res) => {
        const {id} = req?.body;
        if(!id || isNaN(id)) {
            return res.status(400).json({error: "Undefined task id"});
        };
        
        try {
            const query = `
            DELETE FROM tasks
            WHERE id = ?;
            `;
            await connection.execute(query, [id]);
            return res.status(200).json({body: id, message: `Task #${id} removed`});
        } catch (err) {
            console.error(err);
            return res.status(500).json({error: "Server error"});
        }
    },
    modify: async (req, res) => {
        //getting data
        const {taskObj} = req?.body;
        if(!taskObj) {
            return res.status(400).json({error: "Undefined taskObj"});
        }

        //vallidating data
        const {group_id} = req?.params;
        if(!group_id || isNaN(group_id)) {
            return res.status(400).json({error: "Undefined group_id"});
        };

        if(!taskObj?.id || isNaN(taskObj?.id)) {
            return res.status(400).json({body: taskObj, error: "Undefined task id"});
        };

        const regexTitle = /^[A-Za-zÀ-ÖØ-öø-ÿ'\s-]{1,50}$/;
        if(!taskObj?.title || !regexTitle.test(taskObj?.title)) {
            return res.status(400).json({body: taskObj, error: "Invalid title"});
        };
        
        const regexDescription = /^[A-Za-zÀ-ÖØ-öø-ÿ'\s-]{1,255}$/;
        if(taskObj?.description && !regexDescription.test(taskObj.description)) {
            return res.status(400).json({body: taskObj, error: "Invalid description"});
        };

        const validStatus = ["Incomplete", "Completed"];
        if(!taskObj?.status || !validStatus.some(status => status === taskObj.status)) {
            return res.status(400).json({body: taskObj, error: "Invalid status data"});
        }

        try {
            const queryGroup = `
            SELECT *
            FROM \`groups\`
            WHERE id = ?;
            `;

            const [rowGroup] = await connection.execute(queryGroup, [group_id]);
            if(rowGroup.length === 0) {
            return res.status(400).json({body: taskObj, error: "Group not identified"});
            }
            
            const queryModifyTask = `
            UPDATE tasks
            SET title = ?, description = ?, group_id = ?, status = ?
            WHERE id = ?;
            `;
            const [rowTask] = await connection.execute(queryModifyTask, [taskObj.title, taskObj?.description || null, group_id, taskObj.status, taskObj.id]);
            return res.status(200).json({body: taskObj, message: `Task #${taskObj.id} modified`});
        } catch (err) {
            console.error(err);
            return res.status(500).json({error: "Server error"});
        }
    },
    get: async (req, res) => {
        const {group_id} = req?.params;
        if(!group_id || isNaN(group_id)) {
            return res.status(400).json({error: "Undefined or invalid group's id"});
        };
        
        const query = `
        SELECT *
        FROM tasks
        WHERE \`group_id\` = ?
        `

        try {
            const [rows] = await connection.execute(query, [group_id]);
            return res.status(200).json({body: rows});
        } catch (err) {
            console.error(err);
            return res.status(500).json({error: "Server error"});
        }
    },
    updateStatus: async (req, res) => {
        const {updateStatusObj} = req?.body;
        if(!updateStatusObj?.task_id || isNaN(updateStatusObj?.task_id)) {
            return res.status(400).json({error: "Undefined task id"});
        };

        const validStatus = ["Incomplete", "Completed"];
        if(!updateStatusObj?.status || !validStatus.some(status => status === updateStatusObj.status)) {
            return res.status(400).json({error: "Invalid status's data"});
        };

        try {
            const query = `
            UPDATE tasks
            SET status = ?
            WHERE id = ?; 
            `;
            await connection.execute(query, [updateStatusObj.status, updateStatusObj.task_id]);
            return res.status(200).json({body: updateStatusObj, message: "Status updated"});
        } catch (err) {
            console.error(err);
            return res.status(500).json({error: "Server error"});
        }
    }
}

module.exports = task;