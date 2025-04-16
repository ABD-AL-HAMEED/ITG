CREATE DATABASE IF NOT EXISTS `itg`;
USE `itg`;
--
-- Table structure for table `candidates`
--

CREATE TABLE `candidates` (
  `id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `is_favorite` tinyint(1) DEFAULT 0,
  `applied_position_id` int(11) DEFAULT NULL,
  `skills` text DEFAULT NULL,
  `resume_path` varchar(255) DEFAULT NULL,
  `application_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `candidates`
--

INSERT INTO `candidates` (`first_name`, `last_name`, `email`, `phone`, `is_favorite`, `applied_position_id`, `skills`, `resume_path`, `application_date`) VALUES
('Abd Al-Hamid ', 'Kashoqa ', 'aalhmeed632@gmail.com ', '+962775944352', 0, 3, 'Power BI', 'uploads/resumes/Abd Al-Hamid Kashouka CV.pdf', '2025-03-19 16:26:12'),
('Ahmad', 'T', 'ahmaaad@gmail.com', '+962779486571', 0, 9, NULL, 'uploads/resumes/Hossam-Ali.pdf', '2025-04-07 00:33:26'),
('Omar', 'Musa', 'om55648@gmail.com', '+962793549827', NULL, 11, NULL, 'uploads/resumes/Aya Abdelfattah.pdf', '2025-04-09 12:55:26');

-- --------------------------------------------------------

--
-- Table structure for table `candidate_detailed_info`
--

CREATE TABLE `candidate_detailed_info` (
  `id` int(11) NOT NULL,
  `candidate_id` int(11) NOT NULL,
  `Specialty` varchar(255) DEFAULT NULL,
  `SKILLS` text DEFAULT NULL,
  `SOFT_SKILLS` text DEFAULT NULL,
  `Courses_Certifications` text DEFAULT NULL,
  `Languages` text DEFAULT NULL,
  `EXPERIENCE` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `candidate_detailed_info`
--

INSERT INTO `candidate_detailed_info` (`id`, `candidate_id`, `Specialty`, `SKILLS`, `SOFT_SKILLS`, `Courses_Certifications`, `Languages`, `EXPERIENCE`) VALUES
(14, 1, 'Business Analyst', 'C, Java, PHP, HTML, CSS, JavaScript, SQL, RESTful APIs, MySQL', 'organization, attention to detail, creativity, leadership, problem solving, teamwork', '', 'Arabic, English', 'Managed financial transactions, including data entry and bookkeeping. Prepared invoices, tracked expenses, and managed budgets. Developed skills in data management.');

-- --------------------------------------------------------

--
-- Table structure for table `candidate_skills`
--

CREATE TABLE `candidate_skills` (
  `id` int(11) NOT NULL,
  `candidate_id` int(11) NOT NULL,
  `skill_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `education`
--

CREATE TABLE `education` (
  `id` int(11) NOT NULL,
  `institution_name` varchar(255) NOT NULL,
  `degree` varchar(255) NOT NULL,
  `field_of_study` varchar(255) NOT NULL,
  `graduation_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `positions`
--

CREATE TABLE `positions` (
  `id` int(11) NOT NULL,
  `position_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `Required_Experience` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `positions`
--

INSERT INTO `positions` (`id`, `position_name`, `description`, `Required_Experience`) VALUES
(1, 'Business Analyst', 'Analyzes business needs and processes to optimize performance', 3),
(2, 'Graphic Designer', 'Creates visual concepts and designs for marketing materials', 5),
(3, 'Human Resources', 'Manages employee relations and organizational policies', 3),
(4, 'Cybersecurity', 'Protects systems and networks from cyber threats', 8),
(5, 'AI Developer', 'Develops AI-driven applications and machine learning models', 1),
(9, 'cyber', 'test', 10),
(11, 'Big Data Engineer', 'Hadoop\nPower BI', 3);

-- --------------------------------------------------------

--
-- Table structure for table `position_skills`
--

CREATE TABLE `position_skills` (
  `id` int(11) NOT NULL,
  `position_id` int(11) NOT NULL,
  `skill_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `position_skills`
--

INSERT INTO `position_skills` (`id`, `position_id`, `skill_id`) VALUES
(2, 1, 2),
(12, 2, 12),
(13, 2, 13),
(14, 2, 14),
(15, 2, 15),
(16, 2, 16),
(17, 2, 17),
(18, 2, 18),
(19, 2, 19),
(20, 2, 20),
(21, 2, 21),
(22, 3, 22),
(23, 3, 23),
(24, 3, 24),
(25, 3, 25),
(26, 3, 7),
(28, 3, 27),
(29, 3, 28),
(30, 4, 29),
(31, 4, 30),
(32, 4, 31),
(33, 4, 32),
(34, 4, 33),
(35, 4, 8),
(36, 4, 10),
(37, 4, 34),
(38, 5, 35),
(39, 5, 36),
(40, 5, 37),
(41, 5, 38),
(42, 5, 39),
(43, 5, 40),
(44, 5, 41),
(45, 5, 42),
(46, 5, 43),
(47, 5, 44),
(48, 1, 1),
(49, 1, 3),
(50, 1, 4),
(51, 1, 5),
(52, 1, 6),
(53, 1, 7),
(55, 1, 9),
(56, 1, 10),
(57, 1, 11),
(64, 3, 26),
(65, 3, 45),
(66, 3, 46),
(67, 9, 5),
(68, 9, 1),
(69, 9, 3),
(72, 11, 3),
(73, 11, 5);

-- --------------------------------------------------------

--
-- Table structure for table `skills`
--

CREATE TABLE `skills` (
  `id` int(11) NOT NULL,
  `skill_name` varchar(100) NOT NULL,
  `type` enum('Technical','Soft') NOT NULL,
  `Description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `skills`
--

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

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','recruiter','user') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password_hash`, `role`, `created_at`) VALUES
(1, 'Admin', 'Administrator', 'Admin@Administration.com', 'Admin123', 'admin', '0000-00-00 00:00:00');
