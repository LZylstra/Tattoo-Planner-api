BEGIN;

TRUNCATE tattoo_users;

INSERT INTO tattoo_users (user_name, full_name, password)
VALUES
('lzylstra', 'Lindsey Zylstra', '$2a$12$d1t6lPTxudxoqWG2dCfZ4u9R0lXUE4RFC2dzqHi5mUM/DC7D8VIqm'),
('demo', 'Demo User', '$2a$12$d1t6lPTxudxoqWG2dCfZ4u9R0lXUE4RFC2dzqHi5mUM/DC7D8VIqm')
;
COMMIT;