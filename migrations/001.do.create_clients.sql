CREATE TABLE clients (
     id SERIAL PRIMARY KEY,
     full_name TEXT NOT NULL,
     phone TEXT,
     email TEXT,
     client_rating INTEGER
);