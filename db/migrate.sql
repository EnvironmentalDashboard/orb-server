CREATE TABLE `orb-server_bulbs` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `owner` int(11) NOT NULL,
  `selector` varchar(255) NOT NULL,
  `orb` int(11) DEFAULT NULL,
  `enabled` tinyint(1) NOT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orb_server_bulbs_selector_unique` (`selector`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `orb-server_orbs` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `owner` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `relativeValue1Id` varchar(255) DEFAULT NULL,
  `relativeValue2Id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `orb-server_users` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `token` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `fname` varchar(100) DEFAULT NULL,
  `lname` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `pauseUntil` timestamp NULL DEFAULT NULL,
  `badToken` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `orb_server_users_token_unique` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
