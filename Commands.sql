CREATE DATABASE serverexpress;

USE serverexpress;

CREATE TABLE users (
	id INT PRIMARY KEY AUTO_INCREMENT,
   userName VARCHAR(100) NOT NULL ,
	userEmail VARCHAR(30) NOT NULL
);