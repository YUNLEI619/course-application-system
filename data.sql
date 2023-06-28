-- MySQL dump 10.13  Distrib 8.0.33, for macos13 (arm64)
--
-- Host: nus-iss-db.mysql.database.azure.com    Database: caps_db
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

-- Table structure for table `admin`

DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `admin_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `admin_username` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `admin_password` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gmt_create` datetime DEFAULT NULL,
  `gmt_modified` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `pk_admin_id` (`admin_id`),
  UNIQUE KEY `uk_admin_username` (`admin_username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `admin` VALUES (1, 'A0000001', '$2a$04$8vmyD9YNZ9QZX4NBV6GAQ.r2kDbgUky5bXiEFdhBeXHlEuc.rIve6', '2023-01-14 08:00:30', '2023-01-15 09:32:45'), (2, 'A0000002', '$2a$04$bj/tRK0VE4bkQ5iq1LmnAeo.Mi.1pI3DDTC7O79oRw9nW6qbXXMjG', '2023-01-18 09:20:28', '2023-02-24 16:03:23');



--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `course_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `course_code` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_credits` tinyint unsigned NOT NULL,
  `course_capacity` tinyint unsigned NOT NULL,
  `course_vacancy` tinyint unsigned NOT NULL,
  `course_enrollment_status` tinyint NOT NULL,
  `course_faculty_id` bigint unsigned NOT NULL,
  `course_status` tinyint NOT NULL,
  `gmt_create` datetime DEFAULT NULL,
  `gmt_modified` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`course_id`),
  UNIQUE KEY `pk_course_id` (`course_id`),
  UNIQUE KEY `uk_course_code` (`course_code`),
  KEY `fk_course_faculty` (`course_faculty_id`),
  CONSTRAINT `fk_course_faculty` FOREIGN KEY (`course_faculty_id`) REFERENCES `faculty` (`faculty_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES (1, 'SB001', 'Biology', 10, 50, 40, 0, 1, 1, '2023-06-01 15:18:00', '2023-06-02 12:03:41'),
(2, 'SP001', 'Physics', 10, 50, 42, -1, 1, 2, '2023-06-10 11:55:23', NULL),
(3, 'SC001', 'Chemistry', 8, 40, 33, 0, 1, 0, '2023-06-01 11:20:00', '2023-06-03 09:10:40'),
(4, 'SC002', 'Computer Science', 8, 40, 35, 0, 1, 1, '2023-06-06 09:30:00', '2023-06-19 13:10:30'),
(5, 'CL001', 'Constitutional Law', 10, 50, 40, -1, 2, 2, '2023-06-4 15:50:00', NULL),
(6, 'CL002', 'Criminal Law', 10, 50, 33, 0, 2, 0, '2023-06-02 10:30:00', '2023-06-07 11:08:05'),
(7, 'CL003', 'Contract Law', 10, 50, 20, 0, 2, 1, '2023-06-20 12:30:43', '2023-06-23 16:39:39'),
(8, 'IL001', 'International Law', 8, 40, 35, 0, 2, 2, '2023-06-6 13:23:09', NULL),
(9, 'AE001', 'English Literature', 8, 40, 37, 0, 3, 2, '2023-06-20 11:06:33', NULL),
(10, 'AH003', 'History', 8, 40, 20, 0, 3, 1,'2023-06-02 13:30:30', NULL),
(11, 'AP005', 'Psychology', 8, 40, 30, 0, 3, 1, '2023-06-07 14:07:10', '2023-06-09 12:30:31'),
(12, 'AF006', 'Fine Arts', 10, 50, 25, -1, 3, 2, '2023-06-14 09:05:20', NULL),
(13, 'BM001', 'Marketing', 8, 40, 27, 0, 4, 0, '2023-06-08 09:07:23', '2023-06-09 07:59:59'),
(14, 'BF001', 'Finance', 10, 50, 36, 0 , 4, 1, '2023-06-24 10:23:08', '2023-06-28 08:59:50'),
(15, 'BM007', 'Management', 10, 50, 35, -1, 4, 2, '2023-06-07 11:01:00', NULL),
(16, 'BB001', 'Business Ethics', 8, 40, 18, 0, 4, 1, '2023-06-11 15:20:29', '2023-06-12 08:57:00'),
(17, 'EM001', 'Mechanical Engineering', 10, 50, 33, -1, 5, 2, '2023-06-17 14:37:33', NULL),
(18, 'EE001', 'Electrical Engineering', 10, 50, 42, 0, 5, 1,'2023-06-02 13:00:30', '2023-06-16 13:31:31'),
(19, 'EC005', 'Civil Engineering', 8, 40, 30, 0, 5, 0,'2023-06-08 11:00:00', '2023-06-17 13:07:07'),
(20, 'EC008', 'Computer Engineering', 10, 50, 40, 0, 5, 1,'2023-06-01 17:00:30', '2023-06-20 09:09:09');
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_lecturer`
--

DROP TABLE IF EXISTS `course_lecturer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_lecturer` (
  `course_lecturer_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `course_id` bigint unsigned NOT NULL,
  `lecturer_id` bigint unsigned NOT NULL,
  `course_lecturer_status` tinyint NOT NULL,
  `gmt_create` datetime DEFAULT NULL,
  `gmt_modified` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`course_lecturer_id`),
  UNIQUE KEY `pk_course_lecturer_id` (`course_lecturer_id`),
  UNIQUE KEY `uk_course_id_lecturer_id` (`course_id`,`lecturer_id`),
  KEY `fk_course_lecturer_lecturer` (`lecturer_id`),
  CONSTRAINT `fk_course_lecturer_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`),
  CONSTRAINT `fk_course_lecturer_lecturer` FOREIGN KEY (`lecturer_id`) REFERENCES `lecturer` (`lecturer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_lecturer`
--

LOCK TABLES `course_lecturer` WRITE;
/*!40000 ALTER TABLE `course_lecturer` DISABLE KEYS */;
INSERT INTO `course_lecturer` VALUES 
(1, 1, 1, 0, NULL, '2023-06-25 05:59:50'),
(2, 4, 1, 0, NULL, '2023-06-24 14:10:13'),
(3, 2, 2, 0, NULL, '2023-06-24 09:38:54'),
(4, 3, 2, 0, NULL, '2023-06-24 14:09:57'),
(5, 5, 3, 0, NULL, NULL),
(6, 8, 3, 0, NULL, NULL),
(7, 6, 4, 0, '2023-06-25 21:10:40', '2023-06-25 21:10:40'),
(8, 7, 4, 0, NULL, '2023-02-10 17:25:00'),
(9, 9, 5, 0, NULL, NULL),
(10, 10, 5, 0, NULL, NULL),
(11, 11, 6, 0, '2023-01-25 09:30:00', '2023-01-25 09:30:00'),
(12, 12, 6, 0, NULL, NULL),
(13, 14, 7, 0, NULL, NULL),
(14, 15, 7, 0, '2023-04-01 10:45:00', '2023-04-01 10:45:00'),
(15, 13, 8, 0, NULL, '2023-04-05 12:55:00'),
(16, 16, 8, 0, NULL, NULL),
(17, 17, 9, 0, '2023-01-20 11:20:00', '2023-01-20 11:20:00'),
(18, 19, 9, 0, NULL, NULL),
(19, 18, 10, 0, NULL, NULL),
(20, 20, 10, 0, NULL, NULL);


/*!40000 ALTER TABLE `course_lecturer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_schedule`
--

DROP TABLE IF EXISTS `course_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_schedule` (
  `course_schedule_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `course_id` bigint unsigned NOT NULL,
  `schedule_id` bigint unsigned NOT NULL,
  `course_schedule_classroom` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gmt_create` datetime DEFAULT NULL,
  `gmt_modified` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`course_schedule_id`),
  UNIQUE KEY `pk_course_schedule_id` (`course_schedule_id`),
  UNIQUE KEY `uk_course_id_schedule_id` (`course_id`,`schedule_id`),
  KEY `fk_course_schedule_schedule` (`schedule_id`),
  CONSTRAINT `fk_course_schedule_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`),
  CONSTRAINT `fk_course_schedule_schedule` FOREIGN KEY (`schedule_id`) REFERENCES `schedule` (`schedule_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_schedule`
--

LOCK TABLES `course_schedule` WRITE;
/*!40000 ALTER TABLE `course_schedule` DISABLE KEYS */;
INSERT INTO `course_schedule` VALUES 
(1, 1, 1, 'classroom1', '2023-06-26 09:30:00', '2023-06-26 11:00:00'),
(2, 1, 2, 'classroom1', '2023-06-26 10:45:00', '2023-06-26 13:30:00'),
(3, 1, 10, 'classroom1', '2023-06-26 11:15:00', '2023-06-26 14:45:00'),
(4, 2, 3, 'classroom2', '2023-06-26 10:30:00', '2023-06-26 12:45:00'),
(5, 2, 4, 'classroom1', '2023-06-26 12:15:00', '2023-06-26 15:00:00'),
(6, 2, 5, 'classroom1', '2023-06-26 14:30:00', '2023-06-26 16:30:00'),
(7, 6, 7, 'classroom1', '2023-06-26 09:00:00', '2023-06-26 11:45:00'),
(8, 6, 8, 'classroom2', '2023-06-26 10:15:00', '2023-06-26 13:00:00'),
(9, 6, 1, 'classroom2', '2023-06-26 11:30:00', '2023-06-26 14:15:00'),
(10, 2, 6, 'classroom1', '2023-06-26 13:45:00', '2023-06-26 16:30:00'),
(11, 2, 8, 'classroom1', '2023-06-26 15:00:00', '2023-06-26 17:45:00'),
(12, 2, 9, 'classroom3', '2023-06-26 10:30:00', '2023-06-26 13:15:00'),
(13, 5, 1, 'classroom3', '2023-06-26 12:45:00', '2023-06-26 15:30:00'),
(14, 5, 9, 'classroom1', '2023-06-26 14:00:00', '2023-06-26 16:45:00'),
(15, 7, 7, 'classroom2', '2023-06-26 09:30:00', '2023-06-26 12:15:00'),
(16, 7, 2, 'classroom3', '2023-06-26 11:45:00', '2023-06-26 14:30:00'),
(17, 7, 5, 'classroom2', '2023-06-26 14:00:00', '2023-06-26 16:45:00'),
(18, 10, 3, 'classroom1', '2023-06-26 10:30:00', '2023-06-26 13:15:00'),
(19, 10, 4, 'classroom2', '2023-06-26 12:45:00', '2023-06-26 15:30:00'),
(20, 10, 6, 'classroom3', '2023-06-26 14:00:00', '2023-06-26 16:45:00');

/*!40000 ALTER TABLE `course_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_student`
--

DROP TABLE IF EXISTS `course_student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_student` (
  `course_student_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `course_id` bigint unsigned NOT NULL,
  `student_id` bigint unsigned NOT NULL,
  `course_student_grade` decimal(4,2) DEFAULT NULL,
  `course_student_status` tinyint NOT NULL,
  `gmt_create` datetime DEFAULT NULL,
  `gmt_modified` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`course_student_id`),
  UNIQUE KEY `pk_course_student_id` (`course_student_id`),
  UNIQUE KEY `uk_course_id_student_id` (`course_id`,`student_id`),
  KEY `fk_course_student_student` (`student_id`),
  CONSTRAINT `fk_course_student_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`),
  CONSTRAINT `fk_course_student_student` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_student`
--

LOCK TABLES `course_student` WRITE;
/*!40000 ALTER TABLE `course_student` DISABLE KEYS */;
INSERT INTO `course_student` VALUES 
(1, 1, 1, 83.00, 2, '2023-06-16 19:51:17', '2023-06-25 19:11:42'),
(2, 2, 2, 0.00, -1, '2023-06-16 19:59:07', '2023-06-16 20:06:42'),
(3, 3, 11, 69.00, 2, '2023-06-26 12:15:00', '2023-06-26 15:00:00'),
(4, 4, 12, NULL, 1, '2023-06-26 10:30:00', '2023-06-26 13:15:00'),
(5, 5, 3, NULL, 0, '2023-06-26 10:30:00', '2023-06-26 13:15:00'),
(6, 6, 4, NULL, 1, '2023-06-24 10:30:49', '2023-06-25 12:13:10'),
(7, 7, 13, 90.00, 2, '2023-06-26 10:45:00', '2023-06-26 13:30:00'),
(8, 7, 14, 59.00, 3, '2023-06-24 10:32:28', '2023-06-24 06:32:20'),
(9, 9, 5, NULL, 0, '2023-06-24 10:43:41', '2023-06-25 12:13:42'),
(10, 10, 6, NULL, 0, '2023-06-24 10:43:45', '2023-06-24 10:43:45'),
(11, 11, 15, NULL, 1, '2023-06-26 12:45:00', '2023-06-26 15:30:00'),
(12, 12, 16, 77.00, 2, '2023-06-26 11:30:00', '2023-06-26 14:15:00'),
(13, 13, 7, 40.00, 3, NULL, '2023-06-24 20:40:10'),
(14, 14, 8, NULL, 0, NULL, NULL),
(15, 15, 17, 66, 2, '2023-06-26 12:45:00', '2023-06-26 15:30:00'),
(16, 16, 18, NULL, 1, '2023-06-26 12:45:00', '2023-06-26 15:30:00'),
(17, 17, 9, 36.00, 3, '2023-06-26 14:00:00', '2023-06-26 16:45:00'),
(18, 18, 10, NULL, 0, '2023-06-25 21:10:05', '2023-06-25 13:12:15'),
(19, 19, 19, NULL, 0, NULL, NULL),
(20, 20, 20, NULL, 0, NULL, NULL);

/*!40000 ALTER TABLE `course_student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faculty`
--

DROP TABLE IF EXISTS `faculty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculty` (
  `faculty_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `faculty_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `gmt_create` datetime DEFAULT NULL,
  `gmt_modified` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`faculty_id`) USING BTREE,
  UNIQUE KEY `pk_faculty_id` (`faculty_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faculty`
--

LOCK TABLES `faculty` WRITE;
/*!40000 ALTER TABLE `faculty` DISABLE KEYS */;
INSERT INTO `faculty` VALUES (1, 'Science', '2023-06-14 09:30:00', '2023-06-14 10:45:00'),
  (2, 'Law', '2023-06-14 11:15:00', '2023-06-14 12:30:00'),
  (3, 'Arts', '2023-06-14 13:00:00', '2023-06-14 14:15:00'),
  (4, 'Business', '2023-06-14 14:45:00', '2023-06-14 16:00:00'),
  (5, 'Engineering', '2023-06-14 16:30:00', '2023-06-14 17:45:00');
/*!40000 ALTER TABLE `faculty` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lecturer`
--

DROP TABLE IF EXISTS `lecturer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lecturer` (
  `lecturer_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `lecturer_matriculation_number` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lecturer_password` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lecturer_last_name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lecturer_first_mid_name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lecturer_gender` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lecturer_dob` date NOT NULL,
  `lecturer_faculty_id` bigint unsigned NOT NULL,
  `gmt_create` datetime DEFAULT NULL,
  `gmt_modified` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`lecturer_id`),
  UNIQUE KEY `pk_lecturer_id` (`lecturer_id`),
  UNIQUE KEY `uk_lecturer_matriculation_number` (`lecturer_matriculation_number`),
  KEY `fk_lecturer_faculty` (`lecturer_faculty_id`),
  CONSTRAINT `fk_lecturer_faculty` FOREIGN KEY (`lecturer_faculty_id`) REFERENCES `faculty` (`faculty_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lecturer`
--

LOCK TABLES `lecturer` WRITE;
/*!40000 ALTER TABLE `lecturer` DISABLE KEYS */;
INSERT INTO `lecturer` VALUES (1, 'L001', '$2a$04$LVNCS//5El6NyF8K4ivj6.hUpkpm.Jt43WMvCjezQGq7zJBLlYHu.', 'Smith', 'John', 'Male', '1980-05-10', 1, '2023-01-01 08:00:00', '2023-01-01 08:00:00'),
(2, 'L002', '$2a$04$0PciqSE7M78mNiEJNiCOUOKO1vv0gsyuALHG0P4Nk2wku2kSrIOd2', 'Johnson', 'Emily', 'Female', '1985-09-15', 2, '2023-01-05 10:30:00', '2023-01-05 10:30:00'),
(3, 'L003', '$2a$04$uw.3a4e4kDFh4QTloD9Dqefrje6hNovzUWElYYi2JRSDAsm4D4k8m', 'Brown', 'Michael', 'Male', '1978-12-20', 1, '2023-01-10 14:15:00', '2023-01-10 14:15:00'),
(4, 'L004', '$2a$04$0txueZcGTdal8nqDtE8tBOidjqR3ZG.DKlaFpQs26hY9LmB7XpFfC', 'Davis', 'Jessica', 'Female', '1982-07-25', 3, '2023-01-15 16:45:00', '2023-01-15 16:45:00'),
(5, 'L005', '$2a$04$H1ulY5rzKKDeEI3Bhmy5X.yx.1dJKc9BjnZ45/7P/WpQgsv6IPczO', 'Miller', 'David', 'Male', '1976-02-28', 2, '2023-01-20 11:20:00', '2023-01-20 11:20:00'),
(6, 'L006', '$2a$04$/LmmI4UEz6KaE8CcO9lD8OZZvl9LFbLyNHceODXdkoRRRHzTjIC6O', 'Anderson', 'Sophia', 'Female', '1990-04-02', 1, '2023-01-25 09:30:00', '2023-01-25 09:30:00'),
(7, 'L007', '$2a$04$RkR18ct2.x6xyP28M9vlE.wIkut6kqQc6ds10VkvWa9VpZGplS7L6', 'Wilson', 'Daniel', 'Male', '1988-11-07', 3, '2023-02-01 13:40:00', '2023-02-01 13:40:00'),
(8, 'L008', '$2a$04$baw7cKiQA0PH9J0t0azG/uRJAlYpg.iG8pmZABZeNKwQJxn397z5S', 'Taylor', 'Olivia', 'Female', '1983-06-14', 2, '2023-02-05 15:50:00', '2023-02-05 15:50:00'),
(9, 'L009', '$2a$04$23qPP2PA.u3jRb1/ZLxJbeqNk9sEIgn/5MrSF0JhfuucYKk382Lty', 'Clark', 'Ethan', 'Male', '1979-09-29', 1, '2023-02-10 17:25:00', '2023-02-10 17:25:00'),
(10, 'L010', '$2a$04$tuPZu/cbfCftH6GC1RqtNuHTW8CY3WKw9Hxsq75Pu2MUQb3W/q6XW', 'Lewis', 'Ava', 'Female', '1992-01-03', 3, '2023-02-15 12:10:00', '2023-02-15 12:10:00'),
(11, 'L011', '$2a$04$Fyz6ukaMvVNuIkfOFfKbUeFBXgY52glKFuH527by1qV.sk8E81DFu', 'Walker', 'James', 'Male', '1981-08-18', 2, '2023-02-20 10:05:00', '2023-02-20 10:05:00'),
(12, 'L012', '$2a$04$UQ3PKC0QCQz94QMi7iT9ZusT7hDXoXvCoK3/WpAtelKi/o4CNgLI2', 'Allen', 'Mia', 'Female', '1987-03-23', 1, '2023-02-25 14:50:00', '2023-02-25 14:50:00'),
(13, 'L013', '$2a$04$4aBLnKfTstHerBb8O8CbJebeBB46qzuU95hO2ZoI.9qIe7wJ0ZOD.', 'Harris', 'Noah', 'Male', '1975-10-08', 3, '2023-03-01 16:30:00', '2023-03-01 16:30:00'),
(14, 'L014', '$2a$04$X7tKIje6wSpkRTwwXPo3GOPbH2ixTQljcN/qmdRBZr2UYy.2tZrzK', 'King', 'Emma', 'Female', '1991-07-13', 2, '2023-03-05 09:45:00', '2023-03-05 09:45:00'),
(15, 'L015', '$2a$04$cFaZmf6MIAGs9lbM7bxtX.0tbptx24ufKZeBWmb99cQSOiWf/3YgW', 'Baker', 'Liam', 'Male', '1984-12-18', 1, '2023-03-10 11:55:00', '2023-03-10 11:55:00'),
(16, 'L016', '$2a$04$6HC8xY9lQeXfmoqXKZ6aW.g65ZSuZz19.f6psZoQX0o/bzAJUVZga', 'Turner', 'Isabella', 'Female', '1989-05-25', 3, '2023-03-15 15:20:00', '2023-03-15 15:20:00'),
(17, 'L017', '$2a$04$HBy2ypwsq/aunw15U.f5Pei6t9VwnetCqcogkWbGERvVgn1pXno2K', 'Adams', 'Alexander', 'Male', '1977-02-28', 2, '2023-03-20 13:15:00', '2023-03-20 13:15:00'),
(18, 'L018', '$2a$04$mHbF3H/lzqazKHJObraho.Ec5uOUJRxBCx/Apb1fCPd4RMI2723a2', 'Green', 'Sophia', 'Female', '1986-10-03', 1, '2023-03-25 17:35:00', '2023-03-25 17:35:00'),
(19, 'L019', '$2a$04$Lo55Qg/FlJiESYCq97yjXOMXZSBQ2TyyK4dCNfheoAgQHNW6xDate', 'Hall', 'Charlotte', 'Female', '1993-03-08', 3, '2023-04-01 10:45:00', '2023-04-01 10:45:00'),
(20, 'L020', '$2a$04$ns3rnkq8DmXyr9xqafJN.ul7e1MVoofVjPvwR6AvO8TCTKZYivgSG', 'Scott', 'Benjamin', 'Male', '1980-08-13', 2, '2023-04-05 12:55:00', '2023-04-05 12:55:00');
/*!40000 ALTER TABLE `lecturer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule`
--

DROP TABLE IF EXISTS `schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedule` (
  `schedule_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `schedule_day_of_week` tinyint NOT NULL,
  `schedule_start_time` time NOT NULL,
  `schedule_end_time` time NOT NULL,
  `gmt_create` datetime DEFAULT NULL,
  `gmt_modified` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`schedule_id`),
  UNIQUE KEY `pk_schedule_id` (`schedule_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule`
--

LOCK TABLES `schedule` WRITE;
/*!40000 ALTER TABLE `schedule` DISABLE KEYS */;
INSERT INTO `schedule` VALUES (1,1,'09:00:00','12:00:00','2023-06-25 09:56:12','2023-06-25 09:56:12'),(2,2,'09:00:00','12:00:00','2023-06-25 09:56:31','2023-06-25 09:56:31'),(3,3,'09:00:00','12:00:00','2023-06-25 09:56:34','2023-06-25 09:56:34'),(4,4,'09:00:00','12:00:00','2023-06-25 09:56:36','2023-06-25 09:56:36'),(5,5,'09:00:00','12:00:00','2023-06-25 09:56:41','2023-06-25 09:56:41'),(6,1,'14:00:00','17:00:00','2023-06-25 09:57:17','2023-06-25 09:57:17'),(7,2,'14:00:00','17:00:00','2023-06-25 09:57:53','2023-06-25 09:57:53'),(8,3,'14:00:00','17:00:00','2023-06-25 09:58:01','2023-06-25 09:58:01'),(9,4,'14:00:00','17:00:00','2023-06-25 09:58:03','2023-06-25 09:58:03'),(10,5,'14:00:00','17:00:00','2023-06-25 09:58:05','2023-06-25 09:58:05');
/*!40000 ALTER TABLE `schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `student_id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'Self increasing PK',
  `student_matriculation_number` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Must be unique',
  `student_password` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'We use BCrypt here so length is 60',
  `student_last_name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_first_mid_name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_enrollment_date` datetime NOT NULL,
  `student_gender` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_dob` date NOT NULL,
  `student_faculty_id` bigint unsigned NOT NULL,
  `student_gpa` decimal(3,2) DEFAULT NULL,
  `gmt_create` datetime DEFAULT NULL,
  `gmt_modified` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `uk_student_matriculation_number` (`student_matriculation_number`),
  UNIQUE KEY `pk_student_id` (`student_id`),
  KEY `fk_student_faculty` (`student_faculty_id`),
  CONSTRAINT `fk_student_faculty` FOREIGN KEY (`student_faculty_id`) REFERENCES `faculty` (`faculty_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES (1, 'S0000001', '$2a$04$UKLL1TzPwiE7nzQLKoYxAucDaVgpiTOHGFV1fH.WAyYBdztIof0TK', 'Smith', 'John', '2023-06-01 09:00:00', 'Male', '2000-01-01', 1, 3.50, '2023-06-01 15:18:00', '2023-06-02 12:03:41'),
(2, 'S0000002', '$2a$04$.ecubfLKLvlaOdWRsgeJluMuIAN7GROc3jdi2NG4XhNTmpuTzt6Vi', 'Johnson', 'Emma', '2023-06-07 10:00:00', 'Female', '2001-02-15', 1, 3.75, '2023-06-10 11:55:23', NULL),
(3, 'S0000003', '$2a$04$mqDVsjGfAjW1eEKX1ABZhOHZgsKcqaIYEYxPBvl4.SESWV9zkBQsG', 'Davis', 'Michael', '2023-06-02 11:00:00', 'Male', '2002-07-30', 2, 3.20, '2023-06-4 15:50:00', NULL),
(4, 'S0000004', '$2a$04$TST/a3kRf.ZOmrsCRJ.LSei66Y8SyXRd.BxQsUjvDsro2AKWLHzD2', 'Anderson', 'Sophia', '2023-06-09 12:00:00', 'Female', '2003-05-10', 2, 3.80, '2023-06-02 10:30:00', '2023-06-07 11:08:05'),
(5, 'S0000005', '$2a$04$WbqpcJWiMYmM7CTeEFjr8OeT1M2F.S4wwKdzPXMy/xZbQQDMSkOlq', 'Martinez', 'Daniel', '2023-06-10 12:00:00', 'Male', '2000-12-20', 3, 3.65, '2023-06-20 11:06:33', NULL),
(6, 'S0000006', '$2a$04$2eV/8wOStd66RtYB5aZRHecaDm7U4Hv0AJIH/Q7.rGzt1srwcJNLG', 'Taylor', 'Olivia', '2023-06-01 14:00:00', 'Female', '2001-09-05', 3, 3.40, '2023-06-02 13:30:30', NULL),
(7, 'S0000007', '$2a$04$lX58cd6PmaPFAqZYoeSNKOwTZ2e6hDkOHlkaBP6hdwFCMWqhUIhiK', 'Brown', 'Noah', '2023-06-03 09:00:00', 'Male', '2002-03-18', 4, 3.70, '2023-06-08 09:07:23', '2023-06-09 07:59:59'),
(8, 'S0000008', '$2a$04$YJZlIVzlOkNBs1txNcBuAuNUtFg6wATn4Q2HIYsmECY5qy528Wlcu', 'Wilson', 'Ava', '2023-06-20 09:30:00', 'Female', '2003-11-12', 4, 3.90, '2023-06-24 10:23:08', '2023-06-28 08:59:50'),
(9, 'S0000009', '$2a$04$N4QPTpSb6Zb16YMIXrmi/ud8YmfOdIvkY8FbFAFx8o40MF3A2T52C', 'Lee', 'Ethan', '2023-06-21 10:00:00', 'Male', '2000-08-25', 5, 3.55, '2023-06-17 14:37:33', NULL),
(10, 'S0000010', '$2a$04$jJv8CAf6/xHRhHm9lUpOPOOQAumXuAVSk2sCOvUUCA5kE5tUJdm3i', 'Clark', 'Mia', '2023-06-07 16:00:00', 'Female', '2001-04-07', 5, 3.30, '2023-06-02 13:00:30', '2023-06-16 13:31:31'),
(11, 'S0000011', '$2a$04$wOQrAh2ihcRXL.lAajuM0u.Y679oLUdQ97a3lDNzb7l4JtKUcjBbK', 'Walker', 'James', '2023-06-05 11:20:00', 'Male', '2002-10-22', 1, 3.85, '2023-06-01 11:20:00', '2023-06-03 09:10:40'),
(12, 'S0000012', '$2a$04$QPSR5eTe7jx.NYbM45r0n.KDTRJCjPSybEeInlEVbKMX8Lg7.uQmC', 'Hall', 'Emily', '2023-06-04 13:33:00', 'Female', '2003-06-04', 1, 3.50, '2023-06-06 09:30:00', '2023-06-19 13:10:30'),
(13, 'S0000013', '$2a$04$Bzk/paCf6RJziEXuP8BrjuWFFM81H0mUMMf2foaN8K6Ar.ISuqhp.', 'Adams', 'William', '2023-06-18 14:40:00', 'Male', '2000-03-16', 2, 3.60, '2023-06-20 12:30:43', '2023-06-23 16:39:39'),
(14, 'S0000014', '$2a$04$SyE15BzEVM46p.W6g0ZGNeQgJZVD0NawQD0jrjZK1c2NtDI6HJOaK', 'Lopez', 'Abigail', '2023-06-23 12:00:00', 'Female', '2001-11-28', 2, 3.75, '2023-06-6 13:23:09', NULL),
(15, 'S0000015', '$2a$04$9vINtfFotolgG7R95p32xeLs961zZ6SNxd3klUq2ylu7etpIVHoU2', 'Wright', 'Charlotte', '2023-06-05 12:30:00', 'Female', '2002-07-11', 3, 3.25,'2023-06-07 14:07:10', '2023-06-09 12:30:31'),
(16, 'S0000016', '$2a$04$zvv0BeQTu9uWOTfb1X6OzOOGy92aqMocWt0JzM35CUzqmFE74LFeu', 'Perez', 'Alexander', '2023-06-18 09:20:00', 'Male', '2003-02-23', 3, 3.80, '2023-06-14 09:05:20', NULL),
(17, 'S0000017', '
$2a$04$v5Q8Qh9Y6ZDG7VGAxSGmAOB5qeIp.Jo8q0MPnAc9byUZodH.4ADEG', 'Harris', 'Scarlett', '2023-06-03 12:00:00', 'Female', '2000-10-05', 4, 3.45, '2023-06-07 11:01:00', NULL),
(18, 'S0000018', '$2a$04$7xS7W4rCQiFJQgNkEXWDI.3eoVa8KwQzQGCKoTzG6u43jWOFNPtFa', 'Young', 'Henry', '2023-06-12 13:00:00', 'Male', '2001-05-18', 4, 3.70, '2023-06-11 15:20:29', '2023-06-12 08:57:00'),
(19, 'S0000019', '$2a$04$S.smJjY/0T.yGRGlrX/gX.fzZU0K1gxeS4bbCs2mWFrdX1ogd.RVO', 'King', 'Victoria', '2023-06-11 15:50:00', 'Female', '2002-12-01', 5, 3.35, '2023-06-08 11:00:00', '2023-06-17 13:07:07'),
(20, 'S0000020', '$2a$04$6w5ZfeZxs6lHcrfvo0ysX.6pYCqIUXnX09rTp9pROrAvxywZrpKyG', 'Hill', 'Liam', '2023-06-02 10:37:00', 'Male', '2003-08-14', 5, 3.90, '2023-06-01 17:00:30', '2023-06-20 09:09:09');

/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-26 11:55:39
