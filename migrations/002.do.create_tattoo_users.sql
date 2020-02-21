CREATE TABLE tattoo_users (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_name TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  password TEXT NOT NULL
);

ALTER TABLE clients
  ADD COLUMN
    artist INTEGER REFERENCES tattoo_users(id) ON DELETE SET NULL;