CREATE TABLE IF NOT EXISTS users(
  userId INTEGER Primary Key, -- sqlite doesn't recommend using AUTOINCREMENT
  userName TEXT NOT NULL,
  userPassword TEXT NOT NULL,
  secretkey TEXT DEFAULT ''
);
