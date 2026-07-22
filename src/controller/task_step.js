const connection = require("../config/database.js");

const task_step = {
    create: async (req, res) => {
        //getting data
        const email = req?.token?.sub;
        if(!email) {
            return res.status(400).json({error: "Undefined email"});
        };

        const {task_id} = req?.params;
        if(!task_id || isNaN(task_id)) {
            return res.status({error: "Invalid task_id's data"});
        };

        const {task_step} = req?.body;
        if(!task_step) {
            return res.status(400).json({error: "Undefined task_step"});
        };

        //validating
        const regexTitle = /^[A-Za-zÀ-ÖØ-öø-ÿ'0-9\.\-\s-]{1,100}$/;
        if(!task_step?.title || !regexTitle.test(task_step.title)) {
            return res.status({body: task_step, error: "Invalid title's data"});
        };
        
        const regexDescription = /^[A-Za-zÀ-ÖØ-öø-ÿ'\s-]{1,255}$/;
        if(task_step?.description && !regexDescription.test(task_step.description)) {
            return res.status(400).json({body: task_step, error: "Invalid description's data"});
        };

        try {
            const query = `
            INSERT INTO tasks_steps (task_id, title, description, status, author_email)
            VALUES (?, ?, ?, ?, ?);
            `;

            const [row] = await connection.execute(query, [task_id, task_step.title, task_step.description || null, "Incomplete", email]);
            return res.status(201).json({body: task_step, message: "Task step created sucefully"});
        } catch (err) {
            console.error(err);
            return res.status(500).json({error: "Server error"});
        }
    },
    delete: async (req, res) => {
        //getting data
        const {task_id} = req?.params;
        if(!task_id || isNaN(task_id)) {
            return res.status(400).json({error: "Invalid task_id's data"});
        };

        const {title} = req?.body?.task_step;
        const regexTitle = /^[A-Za-zÀ-ÖØ-öø-ÿ'0-9\.\-\s-]{1,100}$/;
        if(!title || !regexTitle.test(title)) {
            return res.status(400).json({error: "Invalid title's data"});
        };

        try {
            const query = `
            DELETE
            FROM tasks_steps
            WHERE task_id = ? AND title = ?;
            `;

            await connection.execute(query, [task_id, title]);
            return res.status(200).json({body: [{task_id: task_id, title: title}], message: "Task step deleted"});
        } catch (err) {
            console.error(err);
            return res.status(500).json({error: "Server error"});
        }
    },
    modify: async (req, res) => {
        //getting data
        const {task_id} = req?.params;
        if(!task_id || isNaN(task_id)) {
            return res.status({error: "Invalid task_id's data"});
        };

        const {task_step} = req?.body;

        //validatying data
        const regexTitle = /^[A-Za-zÀ-ÖØ-öø-ÿ'0-9\.\-\s-]{1,100}$/;
        if(!task_step?.title || !regexTitle.test(task_step.tile)) {
            return res.status(400).json({error: "Invalid title's data"});
        }

        const regexDescription = /^[A-Za-zÀ-ÖØ-öø-ÿ'\s-]{1,255}$/;
        if(!task_step?.description || !regexDescription.test(task_step.description)) {
            return res.status(400).json({error: "Invalid description's data"});
        };

        try {
            const query = `
            UPDATE tasks_steps
            SET description = ?
            WHERE task_id = ? AND title = ?;
            `;

            const [row] = await connection.execute(query, [task_step.description, task_id, task_step.title]);
            return res.status(201).json({body: task_step, message: "Task step modified sucefully"});
        } catch (err) {
            console.error(err);
            return res.status(500).json({error: "Server error"});
        }
    },
    get: async (req, res) => {
        //getting data
        const {task_id} = req?.params;
        if(!task_id || isNaN(task_id)) {
            return res.status(400).json({error: "Invalid task_id's data"});
        };

        try {
            const query = `
            SELECT *
            FROM tasks_steps
            WHERE task_id = ?;
            `;

            const [row] = await connection.execute(query, [task_id]);
            return res.status(200).json({body: row});
        } catch (err) {
            console.error(err);
            return res.status(500).json({error: "Server error"});
        }
    },
    updateStatus: async (req, res) => {
        const {task_id} = req?.params;
        if(!task_id || isNaN(task_id)) {
            return res.status(400).json({error: "Invalid task_id's data"});
        };

        const {title, status} = req?.body?.task_step;
        const regexTitle = /^[A-Za-zÀ-ÖØ-öø-ÿ'0-9\.\-\s-]{1,100}$/;
        if(!title || !regexTitle.test(title)) {
            return res.status(400).json({error: "Invalid title's data"});
        };

        const validStatus = ["Incomplete", "Completed"];
        if(!status || !validStatus.some(s => s === status)) {
            return res.status(400).json({error: "Invalid status data"});
        };


        try {
            const query = `
            UPDATE tasks_steps
            SET status = ?
            WHERE task_id = ? AND title = ?;
            `;

            await connection.execute(query, [status,task_id, title]);
            return res.status(200).json({body: status, message: "Status changed sucefully"});
        } catch (err) {
            console.error(err);
            return res.status(500).json({error: "Server error"});
        }
    }
};

module.exports = task_step;
