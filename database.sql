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
  `id` bigint(20) NOT NULL,
  `Specialty` varchar(255) DEFAULT NULL,
  `Objective` text DEFAULT NULL,
  `Skills` text DEFAULT NULL,
  `COMPUTER_SKILLS` text DEFAULT NULL,
  `Courses_Certifications` text DEFAULT NULL,
  `Education_id` bigint(20) DEFAULT NULL,
  `Languages` text DEFAULT NULL,
  `EXPERIENCE` text DEFAULT NULL,
  `cv` blob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `candidate_skills` (
  `candidate_id` int(11) NOT NULL,
  `skill_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `education` (
  `id` bigint(20) NOT NULL,
  `institution_name` varchar(255) NOT NULL,
  `degree` varchar(255) NOT NULL,
  `field_of_study` varchar(255) NOT NULL,
  `graduation_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `employees` (
  `id` bigint(20) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `positions` (
  `id` int(11) NOT NULL,
  `position_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `Required_Skill_Set` bigint(20) DEFAULT NULL,
  `Required_Experience` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `position_skills` (
  `id` int(11) NOT NULL,
  `position_id` int(11) NOT NULL,
  `skill_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `skills` (
  `id` int(11) NOT NULL,
  `skill_name` varchar(100) NOT NULL,
  `Description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','recruiter','user') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `positions` (`position_name`, `description`, `Required_Skill_Set`, `Required_Experience`) VALUES
('Business Analyst', 'Analyzes business needs and processes to optimize performance', NULL, NULL),
('Graphic Designer', 'Creates visual concepts and designs for marketing materials', NULL, NULL),
('Human Resources', 'Manages employee relations and organizational policies', NULL, NULL),
('Cybersecurity', 'Protects systems and networks from cyber threats', NULL, NULL),
('AI Developer', 'Develops AI-driven applications and machine learning models', NULL, NULL);

INSERT INTO `skills` (`skill_name`, `Description`) VALUES
('Effective communication', 'Ability to clearly convey information and ideas.'),
('Critical thinking', 'Ability to objectively analyze and evaluate an issue to form a judgment.'),
('Organizational Skills', 'Capability to plan and prioritize tasks efficiently.'),
('Data analysis', 'Examining and interpreting data to extract insights.'),
('SQL', 'Structured Query Language used to manage databases.'),
('Power BI', 'Business analytics tool for data visualization and reporting.'),
('Tableau', 'Data visualization software for business intelligence.'),
('Creativity', 'Generating innovative ideas and unique designs.'),
('Teamwork', 'Collaborating effectively with others to achieve common goals.'),
('Client communication', 'Interacting professionally with clients to understand and fulfill requirements.'),
('Adaptability', 'Ability to adjust to new conditions and challenges.'),
('Adobe Photoshop', 'Software for image editing and graphic design.'),
('Illustrator', 'Vector graphics software used for logo and illustration design.'),
('Adobe XD', 'Design and prototyping tool for UI/UX projects.'),
('UI/UX design', 'Creating user-friendly and aesthetically pleasing digital interfaces.'),
('Animation tools', 'Software used for motion graphics and animations.'),
('Negotiation', 'Skill in reaching mutually beneficial agreements.'),
('Communication', 'Exchanging ideas effectively in various formats.'),
('Active listening', 'Fully concentrating, understanding, and responding to others.'),
('HRMS', 'Human Resource Management System for handling employee data.'),
('Employee data analysis', 'Using data analytics to improve HR processes.'),
('Labor laws', 'Understanding and applying legal regulations in HR.'),
('Problem-solving', 'Identifying and resolving complex issues efficiently.');


-- Adjust the skill_id values according to your database schema.
-- The current values are placeholders and may need to be updated.
-- Here are the correct connection 
/* "Business Analyst": {
        "technical_skills": ["Data analysis", "SQL", "Power BI", "Tableau", "Process modeling", "CRM systems"],
        "soft_skills": ["Communication", "Critical thinking", "Organizational skills", "Problem-solving", "Adaptability"]
    },
    "Graphic Designer": {
        "technical_skills": ["Photoshop", "Illustrator", "UI/UX design", "Animation tools", "Prototyping", "Branding"],
        "soft_skills": ["Creativity", "Collaboration", "Client communication", "Time management"]
    },
    "HR (Human Resources)": {
        "technical_skills": ["HRMS", "Recruitment tools", "Payroll systems", "Compliance tracking"],
        "soft_skills": ["Communication", "Empathy", "Conflict resolution", "Leadership"]
    },
    "Cybersecurity": {
        "technical_skills": ["Network security", "Threat detection", "Penetration testing", "Encryption", "Risk management"],
        "soft_skills": ["Critical thinking", "Problem-solving", "Resilience under pressure"]
    },
    "AI Developer": {
        "technical_skills": ["Machine Learning", "Deep Learning", "Python", "TensorFlow", "NLP", "Computer Vision"],
        "soft_skills": ["Analytical thinking", "Teamwork", "Innovation", "Continuous learning"]
    }
}*/
INSERT INTO `position_skills` (`position_id`, `skill_id`) VALUES
(1, 129),
(1, 130),
( 1, 112),
( 1, 110),
( 1, 109),
( 2, 117),
( 2, 119),
( 2, 120),
( 2, 121),
( 2, 122),
( 2, 123),
( 3, 131),
( 3, 118),
( 3, 125),
( 3, 126),
( 3, 127),
( 3, 128),
( 4, 133),
( 4, 134),
( 4, 135),
( 4, 136),
( 4, 137),
( 4, 138),
( 4, 139),
( 5, 114),
( 5, 115),
( 5, 139),
( 5, 140),
( 5, 141),
( 5, 142),
( 5, 143),
( 5, 113);
