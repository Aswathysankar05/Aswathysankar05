CREATE DATABASE  IF NOT EXISTS `reactservicedeskdatabase` /*!40100 DEFAULT CHARACTER SET latin1 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `reactservicedeskdatabase`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: reactservicedeskdatabase
-- ------------------------------------------------------ 
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `changereq`
--

DROP TABLE IF EXISTS `changereq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `changereq` (
  `chng_id` bigint NOT NULL AUTO_INCREMENT,
  `chng_summary` varchar(45) DEFAULT NULL,
  `chng_priority` varchar(45) NOT NULL,
  `chng_description` text,
  `contact_name` varchar(45) NOT NULL,
  `contact_email` varchar(45) NOT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `closed_at` timestamp NULL DEFAULT NULL,
  `assignmentgroup` varchar(45) DEFAULT NULL,
  `status_id` varchar(45) NOT NULL,
  PRIMARY KEY (`chng_id`),
  KEY `status_id` (`status_id`),
  CONSTRAINT `changereq_ibfk_1` FOREIGN KEY (`status_id`) REFERENCES `status_info` (`status_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20240623 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `incident`
--

DROP TABLE IF EXISTS `incident`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incident` (
  `inc_id` bigint NOT NULL AUTO_INCREMENT,
  `inc_summary` varchar(45) DEFAULT NULL,
  `inc_priority` varchar(45) NOT NULL,
  `inc_description` text,
  `contact_name` varchar(45) NOT NULL,
  `contact_email` varchar(45) NOT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `closed_at` timestamp NULL DEFAULT NULL,
  `assignmentgroup` varchar(45) DEFAULT NULL,
  `status_id` varchar(45) NOT NULL,
  PRIMARY KEY (`inc_id`),
  KEY `status_id` (`status_id`),
  CONSTRAINT `incident_ibfk_1` FOREIGN KEY (`status_id`) REFERENCES `status_info` (`status_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20240830 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `job_info`
--

DROP TABLE IF EXISTS `job_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_info` (
  `job_id` varchar(100) NOT NULL,
  `job_title` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`job_id`),
  UNIQUE KEY `job_title` (`job_title`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_info`
--

LOCK TABLES `job_info` WRITE;
/*!40000 ALTER TABLE `job_info` DISABLE KEYS */;
INSERT INTO `job_info` VALUES ('6','Cloud & DevOps Engineer'),('2','Cloud Engineer'),('11','Cloud Security Engineer'),('1','Cloud Solutions Manager'),('13','Developer'),('4','DevOps Engineer'),('10','Digital Marketing Lead'),('9','Digital Strategy Manager'),('8','Junior Accounts'),('12','Junior Software Engineer'),('7','Senior Cloud & DevOps Engineer'),('3','Senior Cloud Engineer'),('5','Senior DevOps Engineer');
/*!40000 ALTER TABLE `job_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login_info`
--

DROP TABLE IF EXISTS `login_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login_info` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `fullname` varchar(100) NOT NULL,
  `job_id` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phonenumber` varchar(15) NOT NULL,
  `pswd` varchar(100) NOT NULL,
  `pswdcnfrm` varchar(100) NOT NULL,
  `user_type` varchar(50) NOT NULL,
  `user_status` varchar(50) NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `job_id` (`job_id`),
  CONSTRAINT `login_info_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `job_info` (`job_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1007 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login_info`
--

LOCK TABLES `login_info` WRITE;
/*!40000 ALTER TABLE `login_info` DISABLE KEYS */;
INSERT INTO `login_info` VALUES (1001,'Akshara Achuthanandan','11','testuser1@cloudplusinfotech.com','7510547791','U$3r1@c!0uD','U$3r1@c!0uD','User','Active'),
(1002,'Akshaykrishna N','11','testuser2@cloudplusinfotech.com','7510547791','U$3r2@c!0uD','U$3r2@c!0uD','User','Active'),
(1003,'Sneha P U','11','testuser3@cloudplusinfotech.com','7510547791','U$3r3@c!0uD','U$3r3@c!0uD','User','Active'),
(1004,'Akshara Achuthanandan','11','testsupport1@cloudplusinfotech.com','7510547791','sa44oR7$uSr1','sa44oR7$uSr1','Support','Active'),
(1005,'Akshaykrishna N','11','testsupport2@cloudplusinfotech.com','7510547791','sa44oR7$uSr2','sa44oR7$uSr2','Support','Active'),
(1006,'Sneha P U','11','testsupport3@cloudplusinfotech.com','7510547791','sa44oR7$uSr3','sa44oR7$uSr3','Support','Active'),
(1007,'Admin User1','5','adminuser1@cloudplusinfotech.com','7510547791','aDm!91@cl0uD','aDm!91@cl0uD','Admin','Active'),
(1008,'Admin User2','5','adminuser2@cloudplusinfotech.com','7510547791','aDm!92@cl0uD','aDm!92@cl0uD','Admin','Active');
/*!40000 ALTER TABLE `login_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `request`
--

DROP TABLE IF EXISTS `request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `request` (
  `req_id` bigint NOT NULL AUTO_INCREMENT,
  `req_summary` varchar(45) DEFAULT NULL,
  `req_priority` varchar(45) NOT NULL,
  `req_description` text,
  `contact_name` varchar(45) NOT NULL,
  `contact_email` varchar(45) NOT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `closed_at` timestamp NULL DEFAULT NULL,
  `assignmentgroup` varchar(45) DEFAULT NULL,
  `status_id` varchar(45) NOT NULL,
  PRIMARY KEY (`req_id`),
  KEY `status_id` (`status_id`),
  CONSTRAINT `request_ibfk_1` FOREIGN KEY (`status_id`) REFERENCES `status_info` (`status_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20240725 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `status_info`
--

DROP TABLE IF EXISTS `status_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `status_info` (
  `status_id` varchar(45) NOT NULL,
  `status_name` varchar(50) NOT NULL,
  PRIMARY KEY (`status_id`),
  UNIQUE KEY `status_name` (`status_name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status_info`
--

LOCK TABLES `status_info` WRITE;
/*!40000 ALTER TABLE `status_info` DISABLE KEYS */;
INSERT INTO `status_info` VALUES ('1','Open'),('2','Closed'),('3','Assigned'),('4','Unassigned'),('5','On hold'),('6','Work in progress');
/*!40000 ALTER TABLE `status_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `support_services`
--

DROP TABLE IF EXISTS `support_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `support_services` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `code` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `support_services`
--

LOCK TABLES `support_services` WRITE;
/*!40000 ALTER TABLE `support_services` DISABLE KEYS */;
INSERT INTO `support_services` VALUES (1,'Incident Support','We help you quickly report, track, and resolve incidents that disrupt your operations or affect your experience.','INC'),(2,'Request Support','Designed to streamline the process of submitting, monitoring, and fulfilling your requests.','RQ'),(3,'Change Support','We expertly guide to create, manage and updates your change requests to enhance our systems and services.','CHG');
/*!40000 ALTER TABLE `support_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `work_history`
--

DROP TABLE IF EXISTS `work_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `work_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `workid` bigint NOT NULL,
  `work_summary` varchar(45) DEFAULT NULL,
  `action_performed` varchar(45) DEFAULT NULL,
  `work_description` text,
  `performed_by` varchar(45) DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;


/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-30 10:55:19
