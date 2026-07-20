CREATE DATABASE Task_manager;

USE Task_manager;

CREATE TABLE users (
    email VARCHAR(100) NOT NULL,
    name VARCHAR(50) NOT NULL,
    role VARCHAR(10) NOT NULL,
    password VARCHAR(255) NOT NULL,
    register_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY(email)
    );
    
CREATE TABLE `groups` (
		id INT AUTO_INCREMENT NOT NULL,
        PRIMARY KEY(id)  
        );

CREATE TABLE groups_members (
		group_id INT NOT NULL,
		member VARCHAR(100) NOT NULL,
        role_in_the_group VARCHAR(10) NOT NULL,
        PRIMARY KEY(group_id, member),
        CONSTRAINT fk_groups_members_groups
			FOREIGN KEY(group_id)
            REFERENCES `groups`(id)
            ON DELETE CASCADE,
		CONSTRAINT fk_groups_members_users
			FOREIGN KEY(member)
            REFERENCES users(email)
            ON DELETE CASCADE
		);
    
CREATE TABLE tasks (
	id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    `group` INT,
    register_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    author VARCHAR(100) NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT fk_tasks_groups
		FOREIGN KEY (`group`)
        REFERENCES `groups`(id)
        ON DELETE CASCADE
    );
    
CREATE TABLE tasks_steps (
	task_id INT NOT NULL,
    step INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    status VARCHAR(10) NOT NULL,
    author VARCHAR(100) NOT NULL,
    PRIMARY KEY(task_id, step),
    CONSTRAINT fk_tasks_steps_tasks
		FOREIGN KEY (task_id)
        REFERENCES tasks(id)
        ON DELETE CASCADE
        );