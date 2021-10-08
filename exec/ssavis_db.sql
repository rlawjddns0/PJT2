-- MySQL dump 10.13  Distrib 8.0.26, for Linux (x86_64)
--
-- Host: localhost    Database: ssafy_app_db
-- ------------------------------------------------------
-- Server version	8.0.26-0ubuntu0.20.04.2

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
-- Current Database: `ssafy_app_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `ssafy_app_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `ssafy_app_db`;

--
-- Table structure for table `appliances`
--

DROP TABLE IF EXISTS `appliances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appliances` (
  `idx` int NOT NULL,
  `y` int DEFAULT NULL,
  `x` int DEFAULT NULL,
  `state` int DEFAULT NULL,
  PRIMARY KEY (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appliances`
--

LOCK TABLES `appliances` WRITE;
/*!40000 ALTER TABLE `appliances` DISABLE KEYS */;
INSERT INTO `appliances` VALUES (0,103,241,2),(1,153,70,2),(2,149,245,2),(3,150,300,2),(4,92,88,2),(5,100,147,2),(6,138,197,1),(7,189,89,2),(8,167,229,2),(9,176,287,2),(10,225,192,1),(11,152,135,2),(12,189,197,1),(13,204,80,2),(14,187,239,2),(15,189,285,2),(16,233,177,2);
/*!40000 ALTER TABLE `appliances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `belongings`
--

DROP TABLE IF EXISTS `belongings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `belongings` (
  `no` int NOT NULL AUTO_INCREMENT,
  `type` int DEFAULT NULL,
  `user_no` int DEFAULT NULL,
  `photo` varchar(100) DEFAULT NULL,
  `flag` tinyint DEFAULT NULL,
  `datetime` date DEFAULT NULL,
  `position` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`no`),
  KEY `user_no` (`user_no`),
  CONSTRAINT `belongings_ibfk_1` FOREIGN KEY (`user_no`) REFERENCES `user` (`no`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `belongings`
--

LOCK TABLES `belongings` WRITE;
/*!40000 ALTER TABLE `belongings` DISABLE KEYS */;
INSERT INTO `belongings` VALUES (20,1,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-07%2011-48-48.647033.jpg',1,'2021-10-07','-8.431568592990278,-3.9744723206156474'),(21,1,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-07%2012-01-09.274447.jpg',1,'2021-10-07','-6.7703785762918045,-5.855652497546634'),(23,1,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-07%2012-05-20.677315.jpg',1,'2021-10-07','-7.204139523000682,-6.564710154418242'),(53,1,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2000-07-18.335729.jpg',1,'2021-10-08','-6.0837774123370325,-5.115741214090889'),(54,1,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2001-08-16.729547.jpg',1,'2021-10-08','-8.224852307431005,-7.122591947829539'),(55,1,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2001-10-40.055933.jpg',1,'2021-10-08','-5.616986028968273,-6.564919129488635'),(56,3,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2001-19-13.885054.jpg',1,'2021-10-08','-8.546456608435234,-6.248268320766366'),(57,1,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2001-23-08.301717.jpg',1,'2021-10-08','-5.9307381912119,-5.714542671801428'),(58,1,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2001-30-48.201752.jpg',1,'2021-10-08','-5.757214397758956,-7.5308110179604935'),(59,1,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2001-33-05.982116.jpg',1,'2021-10-08','-8.625434144431713,-4.270781178334695'),(60,1,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2001-35-52.976261.jpg',1,'2021-10-08','-7.2462853342411595,-8.331241807337214'),(61,1,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2001-38-15.308238.jpg',1,'2021-10-08','-7.999494873203528,-4.601340817766317'),(62,1,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2001-41-16.343965.jpg',1,'2021-10-08','-7.094097761227732,-8.025998906023187'),(63,1,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2001-45-20.875277.jpg',1,'2021-10-08','-6.664823079957605,-8.39119729263431'),(64,3,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2001-45-24.118287.jpg',1,'2021-10-08','-5.892775377251809,-7.187375267068495'),(65,1,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2001-55-08.092654.jpg',1,'2021-10-08','-7.729598622285613,-9.020561599269836'),(66,1,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2001-55-55.502637.jpg',1,'2021-10-08','-7.384213575405245,-7.853314742367326'),(67,1,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2001-57-55.734269.jpg',1,'2021-10-08','-7.833513729825525,-4.181637721886579'),(68,1,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2002-15-30.672454.jpg',1,'2021-10-08','-7.991987402794356,-4.325017777413206'),(69,3,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2002-17-37.819066.jpg',1,'2021-10-08','-7.440478823991116,-6.175014717564491'),(70,1,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2002-27-43.463716.jpg',1,'2021-10-08','-6.265486171336008,-5.045348737641144'),(71,1,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2002-29-14.375687.jpg',1,'2021-10-08','-7.1228759709558345,-8.0693835039404'),(72,3,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2002-32-23.213461.jpg',1,'2021-10-08','-8.870267505651158,-2.918203077071176'),(73,1,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2002-32-23.790997.jpg',1,'2021-10-08','-8.724743451859739,-3.152878674902566'),(74,1,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2002-34-28.368554.jpg',1,'2021-10-08','-7.587720844380628,-6.654448628589346'),(75,3,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2002-35-05.927426.jpg',1,'2021-10-08','-6.371209371456423,-5.936509677977394'),(76,1,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2002-35-20.236519.jpg',1,'2021-10-08','-7.417262888617213,-5.190701678695695'),(77,1,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2002-38-00.790304.jpg',1,'2021-10-08','-7.449802554199184,-5.2587916312948035'),(78,1,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2003-41-22.934567.jpg',1,'2021-10-08','-7.734584120906438,-4.307883316156022');
/*!40000 ALTER TABLE `belongings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clean`
--

DROP TABLE IF EXISTS `clean`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clean` (
  `no` int NOT NULL,
  `x1` int DEFAULT NULL,
  `x2` int DEFAULT NULL,
  `y1` int DEFAULT NULL,
  `y2` int DEFAULT NULL,
  PRIMARY KEY (`no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clean`
--

LOCK TABLES `clean` WRITE;
/*!40000 ALTER TABLE `clean` DISABLE KEYS */;
INSERT INTO `clean` VALUES (0,0,0,0,0),(1,0,350,0,350),(2,44,105,150,210),(3,230,255,144,195),(4,280,330,143,200),(5,80,122,46,100),(6,130,205,120,240),(7,142,210,43,110);
/*!40000 ALTER TABLE `clean` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `current_mode`
--

DROP TABLE IF EXISTS `current_mode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `current_mode` (
  `user_no` int NOT NULL,
  `mode_no` int NOT NULL,
  KEY `user_no` (`user_no`),
  KEY `mode_no` (`mode_no`),
  CONSTRAINT `current_mode_ibfk_1` FOREIGN KEY (`user_no`) REFERENCES `user` (`no`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `current_mode_ibfk_2` FOREIGN KEY (`mode_no`) REFERENCES `mode` (`no`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `current_mode`
--

LOCK TABLES `current_mode` WRITE;
/*!40000 ALTER TABLE `current_mode` DISABLE KEYS */;
INSERT INTO `current_mode` VALUES (1,1);
/*!40000 ALTER TABLE `current_mode` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `intruders`
--

DROP TABLE IF EXISTS `intruders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `intruders` (
  `no` int NOT NULL AUTO_INCREMENT,
  `user_no` int DEFAULT NULL,
  `photo` varchar(100) DEFAULT NULL,
  `datetime` date DEFAULT NULL,
  PRIMARY KEY (`no`),
  KEY `user_no` (`user_no`),
  CONSTRAINT `intruders_ibfk_1` FOREIGN KEY (`user_no`) REFERENCES `user` (`no`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `intruders`
--

LOCK TABLES `intruders` WRITE;
/*!40000 ALTER TABLE `intruders` DISABLE KEYS */;
INSERT INTO `intruders` VALUES (9,1,'https://ssavis.s3.amazonaws.com/2021-10-07%2013-44-28.885132.jpg','2021-10-07'),(40,1,'https://ssavis.s3.amazonaws.com/2021-10-08%2000-06-59.987188.jpg','2021-10-08'),(41,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2001-08-15.330235.jpg','2021-10-08'),(42,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2001-10-08.858422.jpg','2021-10-08'),(43,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2001-18-20.739314.jpg','2021-10-08'),(44,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2001-22-20.806771.jpg','2021-10-08'),(45,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2001-28-44.816912.jpg','2021-10-08'),(46,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2001-33-54.609642.jpg','2021-10-08'),(47,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2001-35-49.731902.jpg','2021-10-08'),(48,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2001-38-04.195136.jpg','2021-10-08'),(49,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2001-41-10.136998.jpg','2021-10-08'),(50,1,'https://ssavis.s3.amazonaws.com/2021-10-08%2001-44-00.895813.jpg','2021-10-08'),(51,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2001-45-17.753002.jpg','2021-10-08'),(52,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2001-55-08.252786.jpg','2021-10-08'),(53,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2001-55-51.520887.jpg','2021-10-08'),(54,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2001-57-48.530580.jpg','2021-10-08'),(55,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2001-59-41.033405.jpg','2021-10-08'),(56,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2002-15-23.165353.jpg','2021-10-08'),(57,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2002-17-25.244123.jpg','2021-10-08'),(58,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2002-20-40.400718.jpg','2021-10-08'),(59,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2002-22-41.798910.jpg','2021-10-08'),(60,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2002-26-32.740060.jpg','2021-10-08'),(61,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2002-27-31.539405.jpg','2021-10-08'),(62,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2002-29-12.989269.jpg','2021-10-08'),(63,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2002-31-54.531698.jpg','2021-10-08'),(64,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2002-34-26.710110.jpg','2021-10-08'),(65,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2002-35-00.879564.jpg','2021-10-08'),(66,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2002-35-48.857752.jpg','2021-10-08'),(67,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2002-37-39.052548.jpg','2021-10-08'),(68,1,'https://ssavis.s3.ap-northeast-2.amazonaws.com/2021-10-08%2003-41-33.688676.jpg','2021-10-08');
/*!40000 ALTER TABLE `intruders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mode`
--

DROP TABLE IF EXISTS `mode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mode` (
  `no` int NOT NULL AUTO_INCREMENT,
  `user_no` int DEFAULT NULL,
  `mode_name` varchar(20) DEFAULT NULL,
  `iot` varchar(45) DEFAULT NULL,
  `time` varchar(45) DEFAULT NULL,
  `day` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`no`),
  KEY `user_no` (`user_no`),
  CONSTRAINT `mode_ibfk_1` FOREIGN KEY (`user_no`) REFERENCES `user` (`no`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=134 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mode`
--

LOCK TABLES `mode` WRITE;
/*!40000 ALTER TABLE `mode` DISABLE KEYS */;
INSERT INTO `mode` VALUES (-1,1,'','','',''),(1,1,'실내','12112111211211112','',''),(2,1,'외출','22222222222222222','',''),(3,1,'절전','22222212222112222','',''),(4,1,'수면','22222222222122222','',''),(133,1,'깐부','22222212222122222','','');
/*!40000 ALTER TABLE `mode` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `no` int NOT NULL AUTO_INCREMENT,
  `userid` varchar(10) NOT NULL,
  `email` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  PRIMARY KEY (`no`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'rlawjddns0','rlawjddn','$2b$10$buGCoyeLMjpWkIiwBCx8MuCHgMTC5HKbTRzkCULP5VUkDiKiwQeqm');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-10-07 19:10:43
