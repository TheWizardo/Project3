-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 14, 2022 at 01:09 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project3`
--
CREATE DATABASE IF NOT EXISTS `project3` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `project3`;

-- --------------------------------------------------------

--
-- Table structure for table `destinations`
--

CREATE TABLE `destinations` (
  `destinationID` int(11) NOT NULL,
  `destinationName` varchar(50) NOT NULL,
  `destinationDescription` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `destinations`
--

INSERT INTO `destinations` (`destinationID`, `destinationName`, `destinationDescription`) VALUES
(1, 'Italy', 'Silencio Bruno!\r\nCome and join Luca on his journey!'),
(2, 'France', 'Visit \'Gusteau\'s\', the place ratatouille started! And stay at Linguini\'s house overlooking the Eiffel Tower.'),
(3, 'Germany', 'Help poor Rapunzel escape from her terrifying mother.  '),
(4, 'New Orleans', 'Have you ever seen a princess frog?\r\nAnd what about a crocodile with a trumpet?'),
(5, 'Hawaii', 'Come and learn the true meaning of Ohana, along with our favorite blue alien!'),
(7, 'Scotland', 'Have I ever told you about the time I fought Mordu?'),
(8, 'Venezuela', 'The magnificent Paradise Falls are just out of reach.\r\nJoin Carl, Russell, Kevin and Dug.'),
(9, 'USA', 'Watch the amazing Lightning McQueen racing through Radiator Springs'),
(10, 'Australia', 'I shall call him Squishy and he shall be mine, and he shall be my Squishy.'),
(11, 'Axiom', 'The jewel of the BNL fleet - the Axiom.\r\nSpend your five-year cruise in style, waited on 24 hours a day, by our fully automated crew.');

-- --------------------------------------------------------

--
-- Table structure for table `followers`
--

CREATE TABLE `followers` (
  `vacationID` int(11) NOT NULL,
  `userID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `followers`
--

INSERT INTO `followers` (`vacationID`, `userID`) VALUES
(1, 2),
(1, 6),
(22, 9),
(21, 9),
(1, 9),
(21, 11),
(21, 6),
(25, 6),
(28, 6),
(29, 5),
(21, 5),
(27, 6);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `roleID` int(11) NOT NULL,
  `roleName` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`roleID`, `roleName`) VALUES
(1, 'Admin'),
(2, 'User');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userID` int(11) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `userRole` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(70) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userID`, `firstName`, `lastName`, `userRole`, `username`, `password`) VALUES
(1, 'root', 'groot', 1, 'root', 'b3a0b79dc69513536f7541c3b436d31d6caccc2141354eac152116a8f42e9f40'),
(2, 'The', 'Wizard', 2, 'TheWizard', 'c1764e423103ba408b513f52202d66611c06880380112d7171ab70e7bb7ed845'),
(5, 'leonardo', 'turtle', 2, 'LeoBlue', 'c5049b6b9c25825f52d3397a8c415b20f9933ba1877e5911a66561f0827bb57c'),
(6, 'qwerty', 'asdfgh', 2, 'taken', '404b2cfc60a6c27899d5fd1fc202ad14351ff091b5b47a66abc0b594df645f07'),
(9, 'qwer', 'asdf', 2, 'qwer', 'c1764e423103ba408b513f52202d66611c06880380112d7171ab70e7bb7ed845'),
(11, 'rewq', 'fdsa', 2, 'rewq', 'c1764e423103ba408b513f52202d66611c06880380112d7171ab70e7bb7ed845');

-- --------------------------------------------------------

--
-- Table structure for table `vacations`
--

CREATE TABLE `vacations` (
  `vacationID` int(11) NOT NULL,
  `vacationImgPath` varchar(100) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `vacationPrice` decimal(11,2) NOT NULL,
  `destinationID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `vacations`
--

INSERT INTO `vacations` (`vacationID`, `vacationImgPath`, `startDate`, `endDate`, `vacationPrice`, `destinationID`) VALUES
(1, '59563d1d-89ce-435e-8dc9-404bfbb9bb5e.jpg', '2022-10-23', '2022-10-29', '650.80', 3),
(21, '7950f836-1481-4d18-b29b-31c9e8aaafd7.jpg', '2022-11-12', '2022-11-28', '257.80', 4),
(22, 'b6460808-b74f-41e4-8666-6ebdd9126713.png', '2022-11-27', '2022-11-28', '748.15', 7),
(23, '8199b647-d989-485f-9ded-1e34c1968d06.png', '2022-10-08', '2022-10-25', '1984.00', 8),
(24, '68c15e97-8cc1-499d-99ee-4608fbaa051c.jpg', '2022-10-28', '2022-10-30', '1376.72', 9),
(25, 'bb257c20-3f81-49fc-8028-f8d1c6f185ef.jpg', '2022-10-02', '2022-10-30', '8197.92', 10),
(26, 'fed92819-b23f-4dfe-acf4-8818f07961ba.png', '2022-11-05', '2022-11-25', '999.98', 5),
(27, '9dd36043-182a-4075-a12b-ccd305135535.jpg', '2105-01-01', '2247-12-31', '9999.99', 11),
(28, '2b9a0682-6b9c-4602-9dea-e270132173f7.jpg', '2022-08-09', '2022-08-18', '376.10', 2),
(29, 'a3961492-188d-4608-96a0-6387ace445bc.jpg', '2022-10-30', '2022-11-15', '471.80', 7),
(30, 'a8e1d137-ffb0-42c7-bf1e-fc98d62be602.jpg', '2022-11-22', '2022-11-29', '19.84', 3),
(31, '981103e1-f5dd-43a0-a730-857505123e5d.jpg', '2022-11-28', '2022-12-02', '587.00', 1),
(35, '7d1626ef-c855-43bf-aaf7-e5cdb20de562.jpg', '2022-11-14', '2022-11-28', '752.00', 10);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `destinations`
--
ALTER TABLE `destinations`
  ADD PRIMARY KEY (`destinationID`);

--
-- Indexes for table `followers`
--
ALTER TABLE `followers`
  ADD KEY `vacationID` (`vacationID`),
  ADD KEY `userID` (`userID`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`roleID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`),
  ADD KEY `userRole` (`userRole`);

--
-- Indexes for table `vacations`
--
ALTER TABLE `vacations`
  ADD PRIMARY KEY (`vacationID`),
  ADD KEY `destinationID` (`destinationID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `destinations`
--
ALTER TABLE `destinations`
  MODIFY `destinationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `roleID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `vacations`
--
ALTER TABLE `vacations`
  MODIFY `vacationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `followers`
--
ALTER TABLE `followers`
  ADD CONSTRAINT `followers_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `followers_ibfk_2` FOREIGN KEY (`vacationID`) REFERENCES `vacations` (`vacationID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`userRole`) REFERENCES `roles` (`roleID`);

--
-- Constraints for table `vacations`
--
ALTER TABLE `vacations`
  ADD CONSTRAINT `vacations_ibfk_1` FOREIGN KEY (`destinationID`) REFERENCES `destinations` (`destinationID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
