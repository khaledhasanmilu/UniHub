-- Create database
CREATE DATABASE UniHub;
USE UniHub;

-- Create `universities` table
CREATE TABLE universities (
    university_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    website VARCHAR(255)
);

-- Create `users` table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL,
    university_id INT,
    profile_picture VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (university_id) REFERENCES universities(university_id) ON DELETE SET NULL
);

-- Create `events` table
CREATE TABLE events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    creator_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type ENUM('intra-university', 'inter-university') NOT NULL,
    start_time DATETIME NOT NULL,
    imageUrl VARCHAR(200),
    venue VARCHAR(255),
    university INT,
    end_time DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (university) REFERENCES universities(university_id) ON DELETE SET NULL,
    FOREIGN KEY (creator_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create `posts` table
CREATE TABLE posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    creator_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create `likes` table
CREATE TABLE likes (
    like_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create `comments` table
CREATE TABLE comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create `jobs` table
CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    job_type ENUM('Full-Time', 'Part-Time', 'Internship', 'Contract') NOT NULL DEFAULT 'Full-Time',
    expected_salary VARCHAR(50) NOT NULL,
    application_deadline DATE NOT NULL,
    required_skills TEXT NOT NULL,
    image_url VARCHAR(255) DEFAULT NULL,
    creator_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(user_id) ON DELETE CASCADE
);


-- Create `research_papers` table
CREATE TABLE research_papers (
    paper_id INT AUTO_INCREMENT PRIMARY KEY,
    uploaded_by INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    abstract TEXT,
    file_url VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(user_id) ON DELETE CASCADE
);

