BEGIN;

TRUNCATE tattoo_users;

INSERT INTO tattoo_users (user_name, full_name, password)
VALUES
('lzylstra', 'Lindsey Zylstra', 'password'),
('azylstra', 'Amanda Zylstra', 'password'),
('demo', 'Demo User', 'password')
;
COMMIT;