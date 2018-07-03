DROP DATABASE IF EXISTS user_db;
CREATE DATABASE user_db;

USE user_db;
CREATE TABLE users
(
    user_id int NOT NULL
    AUTO_INCREMENT,
	userName varchar
    (255) NOT NULL,
    email varchar
    (255) NOT NULL,
    password varchar
    (255) NOT NULL,
	PRIMARY KEY
    (user_id)
);

    USE user_db;
    CREATE TABLE leaderboards
    (
        leaderboard_id int NOT NULL
        AUTO_INCREMENT,
        score int DEFAULT NULL,
    FOREIGN KEY
        (user_id) REFERENCES users
        (user_id),
	PRIMARY KEY
        (leaderboard_id)
);