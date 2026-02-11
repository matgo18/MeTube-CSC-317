# CSC 317 Course Project

## Purpose

The purpose of this project is to create a video hosting web application, including multiple users, likes, comments, aswell as a home page containing a search bar, using HTML, CSS, NodeJS, React and Handlebars


# Build/Run Instructions

## Build Instructions
1. Make sure Node.js, MySQL And MySQL Workbench are correctly installed and that your MySQL server is running.
2. In MySQL Workbench,create a new SQL connection where 'Hostname' is 'localhost', 'Port' is '3306' and 'Username' is 'root'
3. Modify the application/.env file to match your password
4. In MySQL Workbench, copy and paste and execute in a new sql query:
```
CREATE DATABASE my_database;

CREATE TABLE my_database.users (
id int NOT NULL AUTO_INCREMENT,
username varchar(255) NOT NULL,
password varchar(255) NOT NULL,
email varchar(255) DEFAULT NULL,
profile_picture varchar(255) DEFAULT NULL,
PRIMARY KEY (id),
UNIQUE KEY username (username)
);
    
CREATE TABLE my_database.videos (
id int NOT NULL AUTO_INCREMENT,
user_id int NOT NULL,
title varchar(255) DEFAULT NULL,
author varchar(255) DEFAULT NULL,
description varchar(255) DEFAULT NULL,
video_path varchar(500) NOT NULL,
likes int DEFAULT '0',
created_at datetime DEFAULT CURRENT_TIMESTAMP,
thumbnail_path varchar(255) DEFAULT NULL,
PRIMARY KEY (id),
KEY user_id (user_id),
CONSTRAINT videos_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
    
CREATE TABLE my_database.comments (
id int NOT NULL AUTO_INCREMENT,
video_id int NOT NULL,
user_id int NOT NULL,
comment text NOT NULL,
created_at datetime DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (id),
KEY video_id (video_id),
KEY user_id (user_id),
CONSTRAINT comments_ibfk_1 FOREIGN KEY (video_id) REFERENCES videos (id) ON DELETE CASCADE,
CONSTRAINT comments_ibfk_2 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
    
CREATE TABLE my_database.video_likes (
id int NOT NULL AUTO_INCREMENT,
user_id int NOT NULL,
video_id int NOT NULL,
PRIMARY KEY (id),
UNIQUE KEY unique_like (user_id,video_id),
KEY video_id (video_id),
CONSTRAINT video_likes_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
CONSTRAINT video_likes_ibfk_2 FOREIGN KEY (video_id) REFERENCES videos (id) ON DELETE CASCADE
);
```
5. Go to the application folder with
```
cd application/
```
6. Then run
```
npm install
```

## Run Instructions
1. Go to the application folder with
```
cd application/
```
2. Then run
```
npm start
```
3. Navigate to [http://localhost:3000/](http://localhost:3000/) on any browser
