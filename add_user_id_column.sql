-- Add user_id column to records table to link records with users
-- Run this in Supabase SQL Editor

-- Add user_id column if it doesn't exist
ALTER TABLE records 
ADD COLUMN IF NOT EXISTS user_id UUID;

-- Add foreign key constraint to link with users table
ALTER TABLE records
ADD CONSTRAINT fk_user_id
FOREIGN KEY (user_id) 
REFERENCES users(id)
ON DELETE CASCADE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_records_user_id ON records(user_id);

-- Comment
COMMENT ON COLUMN records.user_id IS 'Links record to the user who created it';
