CREATE TYPE status_options AS ENUM ('Planning', 'Completed', 'In Progress');

CREATE TABLE tattoos (
     id SERIAL PRIMARY KEY,
     title TEXT NOT NULL,
     position TEXT,
     info TEXT,
     curr_status status_options NOT NULL,
     tattoo_rating INTEGER,
     client INTEGER REFERENCES clients(id) ON DELETE SET NULL
);