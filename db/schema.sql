CREATE DATABASE user_db;
USE user_db;

CREATE TABLE users
(
    id int NOT NULL
    AUTO_INCREMENT,
	userName varchar
    (255) NOT NULL,
    email varchar
    (255) NOT NULL,
    password varchar
    (255) NOT NULL,
	online BOOLEAN DEFAULT false,
	PRIMARY KEY
    (id)
    );
