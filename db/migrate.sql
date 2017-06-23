CREATE TABLE `orb-server_bulbs` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `owner` int(11) NOT NULL,
  `integration` int(11) NOT NULL,
  `selector` varchar(255) NOT NULL,
  `orb` int(11) DEFAULT NULL,
  `enabled` tinyint(1) NOT NULL,
  `status` varchar(255) DEFAULT NULL,
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
  `email` varchar(255) DEFAULT NULL,
  `fname` varchar(100) DEFAULT NULL,
  `lname` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `owner` int(11) DEFAULT NULL,
  `coreUserID` int(11) DEFAULT NULL,
  `permission` int(11) DEFAULT '0' NOT NULL COMMENT '0 = verification pending, 1 = normal user',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `orb-server_integrations` (
  `id` int(11) NOT NULL,
  `type` int(11) NOT NULL COMMENT '1 LIFX',
  `label` varchar(255) NULL,
  `owner` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL COMMENT '0 bad token, 1 no issues',
  `pauseUntil` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
