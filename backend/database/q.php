-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Jan 01, 2026 at 12:38 PM
-- Server version: 8.0.40
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `betterbee2`
--

-- --------------------------------------------------------

--
-- Table structure for table `chats`
--

CREATE TABLE `chats` (
`id` bigint UNSIGNED NOT NULL,
`from_user_id` bigint UNSIGNED NOT NULL,
`to_user_id` bigint UNSIGNED NOT NULL,
`uid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
`message` text COLLATE utf8mb4_unicode_ci,
`file` text COLLATE utf8mb4_unicode_ci,
`is_read` tinyint(1) NOT NULL DEFAULT '0',
`is_deleted` tinyint(1) NOT NULL DEFAULT '0',
`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
`updated_at` timestamp NULL DEFAULT NULL,
`reply_to` bigint UNSIGNED NOT NULL DEFAULT '0',
`is_hidden` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
`is_edited` tinyint(1) NOT NULL DEFAULT '0',
`is_edit_reflected` tinyint(1) NOT NULL DEFAULT '0',
`is_delete_reflected` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
`id` bigint UNSIGNED NOT NULL,
`uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
`connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
`queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
`payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
`exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
`failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `last_chats`
--

CREATE TABLE `last_chats` (
`id` bigint UNSIGNED NOT NULL,
`original_chat_id` bigint NOT NULL,
`from_user_id` bigint UNSIGNED NOT NULL,
`to_user_id` bigint UNSIGNED NOT NULL,
`uid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
`message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
`file` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
`reply_to` bigint UNSIGNED NOT NULL DEFAULT '0',
`is_hidden` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
`id` int UNSIGNED NOT NULL,
`migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
`batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
`email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
`token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
`created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
`id` bigint UNSIGNED NOT NULL,
`tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
`tokenable_id` bigint UNSIGNED NOT NULL,
`name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
`token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
`abilities` text COLLATE utf8mb4_unicode_ci,
`last_used_at` timestamp NULL DEFAULT NULL,
`expires_at` timestamp NULL DEFAULT NULL,
`created_at` timestamp NULL DEFAULT NULL,
`updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
`id` bigint UNSIGNED NOT NULL,
`json` longtext COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
`id` bigint UNSIGNED NOT NULL,
`name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
`email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
`email_verified_at` timestamp NULL DEFAULT NULL,
`password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
`remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
`created_at` timestamp NULL DEFAULT NULL,
`updated_at` timestamp NULL DEFAULT NULL,
`last_seen` datetime DEFAULT NULL,
`profile` text COLLATE utf8mb4_unicode_ci,
`type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
`is_disabled` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_notification_subscriptions`
--

CREATE TABLE `user_notification_subscriptions` (
`id` int NOT NULL,
`user_id` int NOT NULL,
`subscription` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chats`
--
ALTER TABLE `chats`
ADD PRIMARY KEY (`id`),
ADD KEY `chats_is_read_index` (`is_read`),
ADD KEY `chats_is_deleted_index` (`is_deleted`),
ADD KEY `chats_reply_to_index` (`reply_to`),
ADD KEY `chats_is_hidden_index` (`is_hidden`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `last_chats`
--
ALTER TABLE `last_chats`
ADD PRIMARY KEY (`id`),
ADD KEY `chats_reply_to_index` (`reply_to`),
ADD KEY `chats_is_hidden_index` (`is_hidden`),
ADD KEY `original_chat_id` (`original_chat_id`),
ADD KEY `from_user_id` (`from_user_id`),
ADD KEY `to_user_id` (`to_user_id`),
ADD KEY `uid` (`uid`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `users_email_unique` (`email`),
ADD KEY `users_type_index` (`type`),
ADD KEY `users_is_disabled_index` (`is_disabled`);

--
-- Indexes for table `user_notification_subscriptions`
--
ALTER TABLE `user_notification_subscriptions`
ADD PRIMARY KEY (`id`),
ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chats`
--
ALTER TABLE `chats`
MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `last_chats`
--
ALTER TABLE `last_chats`
MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_notification_subscriptions`
--
ALTER TABLE `user_notification_subscriptions`
MODIFY `id` int NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;