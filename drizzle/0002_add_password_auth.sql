ALTER TABLE `users` MODIFY COLUMN `openId` varchar(128) NOT NULL;
--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN `passwordHash` varchar(255);
--> statement-breakpoint
ALTER TABLE `users` ADD UNIQUE INDEX `users_email_unique` (`email`);
