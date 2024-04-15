CREATE TABLE `officedrummer_account` (
	`userId` text(255) NOT NULL,
	`type` text(255) NOT NULL,
	`provider` text(255) NOT NULL,
	`providerAccountId` text(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text(255),
	`scope` text(255),
	`id_token` text,
	`session_state` text(255),
	PRIMARY KEY(`provider`, `providerAccountId`),
	FOREIGN KEY (`userId`) REFERENCES `officedrummer_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `officedrummer_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`twitchUser` text(256) NOT NULL,
	`twitchId` text(256) NOT NULL,
	`requestText` text(256),
	`sliceSize` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` text,
	`request_played` integer DEFAULT false,
	`request_played_at` text
);
--> statement-breakpoint
CREATE TABLE `officedrummer_session` (
	`sessionToken` text(255) PRIMARY KEY NOT NULL,
	`userId` text(255) NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `officedrummer_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `officedrummer_user` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255),
	`email` text(255) NOT NULL,
	`emailVerified` integer DEFAULT CURRENT_TIMESTAMP,
	`image` text(255)
);
--> statement-breakpoint
CREATE TABLE `officedrummer_verificationToken` (
	`identifier` text(255) NOT NULL,
	`token` text(255) NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
--> statement-breakpoint
CREATE TABLE `officedrummer_wheelStatus` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`status` text(256),
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `officedrummer_account` (`userId`);--> statement-breakpoint
CREATE INDEX `twitchId_idx` ON `officedrummer_requests` (`twitchId`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `officedrummer_session` (`userId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `officedrummer_wheelStatus` (`status`);