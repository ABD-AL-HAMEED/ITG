CREATE DATABASE IF NOT EXISTS `itg`;
USE `itg`;

CREATE TABLE `candidates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `is_favorite` BOOLEAN DEFAULT 0,
  `applied_position_id` int(11) DEFAULT NULL,
  `skills` text DEFAULT NULL,
  `resume_path` varchar(255) DEFAULT NULL,
  `application_date` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `applied_position_id` (`applied_position_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `candidate_detailed_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `candidate_id` int(11) NOT NULL,
  `Specialty` varchar(255) DEFAULT NULL,
  `Objective` text DEFAULT NULL,
  `Skills` text DEFAULT NULL,
  `COMPUTER_SKILLS` text DEFAULT NULL,
  `Courses_Certifications` text DEFAULT NULL,
  `Education_id` int(11) DEFAULT NULL,
  `Languages` text DEFAULT NULL,
  `EXPERIENCE` text DEFAULT NULL,
  `cv` MEDIUMBLOB DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `candidate_id` (`candidate_id`),
  KEY `Education_id` (`Education_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `candidate_skills` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `candidate_id` int(11) NOT NULL,
  `skill_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `candidate_id` (`candidate_id`),
  KEY `skill_id` (`skill_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `education` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `institution_name` varchar(255) NOT NULL,
  `degree` varchar(255) NOT NULL,
  `field_of_study` varchar(255) NOT NULL,
  `graduation_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `employees` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `positions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `position_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `Required_Experience` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `position_skills` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `position_id` int(11) NOT NULL,
  `skill_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `position_id` (`position_id`),
  KEY `skill_id` (`skill_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `skills` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `skill_name` varchar(100) NOT NULL,
  `type` ENUM('Technical', 'Soft') NOT NULL,
  `Description` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','recruiter','user') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `positions` (`position_name`, `description`, `Required_Experience`) VALUES
('Business Analyst', 'Analyzes business needs and processes to optimize performance', NULL),
('Graphic Designer', 'Creates visual concepts and designs for marketing materials', NULL),
('Human Resources', 'Manages employee relations and organizational policies', NULL),
('Cybersecurity', 'Protects systems and networks from cyber threats', NULL),
('AI Developer', 'Develops AI-driven applications and machine learning models', NULL);

-- Insert skills with descriptions
INSERT INTO `skills` (`id`, `skill_name`, `type`, `Description`) VALUES
(1, 'Data analysis', 'Technical', 'Examining and interpreting data to extract insights'),
(2, 'SQL', 'Technical', 'Structured Query Language used to manage databases'),
(3, 'Power BI', 'Technical', 'Business analytics tool for data visualization'),
(4, 'Tableau', 'Technical', 'Data visualization software'),
(5, 'Process modeling', 'Technical', 'Creating business process models'),
(6, 'CRM systems', 'Technical', 'Customer relationship management platforms'),
(7, 'Communication', 'Soft', 'Exchanging ideas effectively'),
(8, 'Critical thinking', 'Soft', 'Objective analysis and evaluation'),
(9, 'Organizational skills', 'Soft', 'Task prioritization and management'),
(10, 'Problem-solving', 'Soft', 'Resolving complex issues efficiently'),
(11, 'Adaptability', 'Soft', 'Adjusting to new conditions and challenges'),
(12, 'Photoshop', 'Technical', 'Image editing software'),
(13, 'Illustrator', 'Technical', 'Vector graphics editor'),
(14, 'UI/UX design', 'Technical', 'User interface/user experience design'),
(15, 'Animation tools', 'Technical', 'Software for creating animations'),
(16, 'Prototyping', 'Technical', 'Creating product prototypes'),
(17, 'Branding', 'Technical', 'Brand identity development'),
(18, 'Creativity', 'Soft', 'Generating innovative ideas'),
(19, 'Collaboration', 'Soft', 'Working effectively with others'),
(20, 'Client communication', 'Soft', 'Professional client interactions'),
(21, 'Time management', 'Soft', 'Efficient task scheduling'),
(22, 'HRMS', 'Technical', 'Human Resource Management Systems'),
(23, 'Recruitment tools', 'Technical', 'Applicant tracking systems'),
(24, 'Payroll systems', 'Technical', 'Salary management software'),
(25, 'Compliance tracking', 'Technical', 'Regulatory compliance monitoring'),
(26, 'Empathy', 'Soft', 'Understanding others\' perspectives'),
(27, 'Conflict resolution', 'Soft', 'Resolving workplace disputes'),
(28, 'Leadership', 'Soft', 'Guiding and motivating teams'),
(29, 'Network security', 'Technical', 'Securing computer networks'),
(30, 'Threat detection', 'Technical', 'Identifying security threats'),
(31, 'Penetration testing', 'Technical', 'Ethical hacking techniques'),
(32, 'Encryption', 'Technical', 'Data encryption methods'),
(33, 'Risk management', 'Technical', 'Identifying and mitigating risks'),
(34, 'Resilience under pressure', 'Soft', 'Maintaining performance in stress'),
(35, 'Machine Learning', 'Technical', 'Developing ML models'),
(36, 'Deep Learning', 'Technical', 'Neural network implementations'),
(37, 'Python', 'Technical', 'Programming language'),
(38, 'TensorFlow', 'Technical', 'Machine learning framework'),
(39, 'NLP', 'Technical', 'Natural Language Processing'),
(40, 'Computer Vision', 'Technical', 'Image recognition systems'),
(41, 'Analytical thinking', 'Soft', 'Logical problem analysis'),
(42, 'Teamwork', 'Soft', 'Collaborating in group settings'),
(43, 'Innovation', 'Soft', 'Implementing new ideas'),
(44, 'Continuous learning', 'Soft', 'Ongoing skill development'),
(45, 'Client communication (HR)', 'Soft', 'Professional client interactions in HR'),
(46, 'Communication (HR)', 'Soft', 'Exchanging ideas effectively in HR'),
(47, 'Client communication (AI)', 'Soft', 'Professional client interactions in AI');

-- Insert position-skills relationships
INSERT INTO `position_skills` (`position_id`, `skill_id`) VALUES
(1, 1), -- Business Analyst: Data analysis
(1, 2), -- Business Analyst: SQL
(1, 3), -- Business Analyst: Power BI
(1, 4), -- Business Analyst: Tableau
(1, 5), -- Business Analyst: Process modeling
(1, 6), -- Business Analyst: CRM systems
(1, 7), -- Business Analyst: Communication
(1, 8), -- Business Analyst: Critical thinking
(1, 9), -- Business Analyst: Organizational skills
(1, 10), -- Business Analyst: Problem-solving
(1, 11), -- Business Analyst: Adaptability

(2, 12), -- Graphic Designer: Photoshop
(2, 13), -- Graphic Designer: Illustrator
(2, 14), -- Graphic Designer: UI/UX design
(2, 15), -- Graphic Designer: Animation tools
(2, 16), -- Graphic Designer: Prototyping
(2, 17), -- Graphic Designer: Branding
(2, 18), -- Graphic Designer: Creativity
(2, 19), -- Graphic Designer: Collaboration
(2, 20), -- Graphic Designer: Client communication
(2, 21), -- Graphic Designer: Time management

(3, 22), -- HR: HRMS
(3, 23), -- HR: Recruitment tools
(3, 24), -- HR: Payroll systems
(3, 25), -- HR: Compliance tracking
(3, 7), -- HR: Communication
(3, 26), -- HR: Empathy
(3, 27), -- HR: Conflict resolution
(3, 28), -- HR: Leadership

(4, 29), -- Cybersecurity: Network security
(4, 30), -- Cybersecurity: Threat detection
(4, 31), -- Cybersecurity: Penetration testing
(4, 32), -- Cybersecurity: Encryption
(4, 33), -- Cybersecurity: Risk management
(4, 8), -- Cybersecurity: Critical thinking
(4, 10), -- Cybersecurity: Problem-solving
(4, 34), -- Cybersecurity: Resilience under pressure

(5, 35), -- AI Developer: Machine Learning
(5, 36), -- AI Developer: Deep Learning
(5, 37), -- AI Developer: Python
(5, 38), -- AI Developer: TensorFlow
(5, 39), -- AI Developer: NLP
(5, 40), -- AI Developer: Computer Vision
(5, 41), -- AI Developer: Analytical thinking
(5, 42), -- AI Developer: Teamwork
(5, 43), -- AI Developer: Innovation
(5, 44); -- AI Developer: Continuous learning
