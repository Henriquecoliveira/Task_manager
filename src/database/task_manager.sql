CREATE DATABASE Task_manager;

USE Task_manager;

CREATE TABLE users (
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    role VARCHAR(10) NOT NULL,
    password VARCHAR(255) NOT NULL,
    register_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY(email)
    );
    
CREATE TABLE `groups` (
		id INT AUTO_INCREMENT NOT NULL,
        name VARCHAR(50),
        PRIMARY KEY(id)  
        );
        
SELECT * FROM `groups_members`;

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
        
        SELECT `groups`.id, `groups`.name, `groups_members`.role_in_the_group
        FROM `groups` 
            INNER JOIN `groups_members`
            ON `groups`.id = `groups_members`.group_id
        WHERE `groups_members`.member = "rafaela@email.com";

CREATE TABLE tasks (
	id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    `group_id` INT NOT NULL,
    register_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    author_email VARCHAR(100) NOT NULL,
    status VARCHAR(10) NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT fk_tasks_groups
		FOREIGN KEY (`group_id`)
        REFERENCES `groups`(id)
        ON DELETE CASCADE,
	CONSTRAINT fk_tasks_users
		FOREIGN KEY (author_email)
        REFERENCES users (email)
        ON DELETE CASCADE
    );
        
CREATE TABLE tasks_steps (
	task_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    status VARCHAR(10) NOT NULL,
    author_email VARCHAR(100) NOT NULL,
    PRIMARY KEY(task_id, title),
    CONSTRAINT fk_tasks_steps_tasks
		FOREIGN KEY (task_id)
        REFERENCES tasks(id)
        ON DELETE CASCADE,
	CONSTRAINT fk_tasks_steps_users
		FOREIGN KEY (author_email)
        REFERENCES users (email)
        ON DELETE CASCADE
	);