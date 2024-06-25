--PSQL 13
-- start transaction;
START TRANSACTION;
CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT UNIQUE, password TEXT,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP, deleted BOOLEAN DEFAULT FALSE);
CREATE TABLE IF NOT EXISTS groups (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT, deleted BOOLEAN DEFAULT FALSE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS rel_user_group (name TEXT, group_id UUID, user_id SERIAL, deleted BOOLEAN DEFAULT FALSE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (user_id, group_id), FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (group_id) REFERENCES groups(id));
COMMIT;
-- alter table groups to add a column 'is_pm_group' 
START TRANSACTION;
ALTER TABLE groups ADD COLUMN IF NOT EXISTS is_pm_group BOOLEAN DEFAULT FALSE;
COMMIT;
-- Yes... i know at this point its pretty much a denormalized table chillax
-- create an index on table groups with is_pm_group column
START TRANSACTION;
ALTER TABLE rel_user_group ADD COLUMN IF NOT EXISTS is_pm_group BOOLEAN DEFAULT FALSE;
CREATE INDEX IF NOT EXISTS idx_is_pm_group ON groups(is_pm_group);
CREATE INDEX IF NOT EXISTS idx_pm_groupid ON rel_user_group(group_id, is_pm_group);
COMMIT;

