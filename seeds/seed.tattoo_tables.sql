BEGIN;

-- TRUNCATE tattoo_users, clients;

INSERT INTO tattoo_users (user_name, full_name, password)
VALUES
('lzylstra', 'Lindsey Zylstra', '$2a$12$d1t6lPTxudxoqWG2dCfZ4u9R0lXUE4RFC2dzqHi5mUM/DC7D8VIqm'),
('demo', 'Demo User', '$2a$12$d1t6lPTxudxoqWG2dCfZ4u9R0lXUE4RFC2dzqHi5mUM/DC7D8VIqm')
;

INSERT INTO clients (full_name, phone, email, client_rating, artist)
VALUES
('Bob Jones', '425-123-9078', 'plaidbeard@gmail.com', 10, 1),
('Janice Bigby', '123-456-7890', 'jbigby@hotmail.com', 5, 2),
('Gabriel Bellamy', '123-424-7670', 'purpleunicorn@hotmail.com', 2, 1),
('Sarah Smith', '223-425-7170', 'superduper@yamjam.com', 8, 2)
;

INSERT INTO tattoos (title, position, info, curr_status, tattoo_rating, client)
VALUES
('Butterfly', 'Shoulder', 'A monarch butterfly with geometric shapes around it', 'Planning', 6, 4),
('Dragon', 'Upper Back', 'A large eastern style dragon', 'In Progress', 8, 1),
('Dog Portrait', 'Thigh', 'A portrait of his dog a poodle mix', 'Planning', 2, 3),
('Tribal Band', 'Upper Arm', null, 'Planning', 4, 2),
('Sunflower', 'Wrist', 'A sunflower with the words you are my sunshine', 'Completed', 1, 4),
('Words', 'Ankle', 'Live Laugh Love', 'Completed', 1, 4)

;
 COMMIT;