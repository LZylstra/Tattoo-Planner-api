CREATE TYPE tattoo_status AS ENUM ('New', 'Upcoming', 'Next', 'Completed');

CREATE TABLE events (
     id SERIAL PRIMARY KEY,
     title TEXT NOT NULL,
     description TEXT,
     eventDate TIMESTAMP NOT NULL,
     start_time TIME,
     end_time TIME ,
     in_person BOOLEAN,
     curr_status tattoo_status NOT NULL,
     all_day BOOLEAN,
     tattoo INTEGER REFERENCES tattoos(id) ON DELETE SET NULL
);