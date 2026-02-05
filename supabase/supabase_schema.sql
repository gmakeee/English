-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: profiles
-- Stores user balance, streak, and daily message linkage.
CREATE TABLE profiles (
  id uuid REFERENCES auth.users PRIMARY KEY,
  first_name text,
  balance int DEFAULT 100,
  streak int DEFAULT 0,
  daily_message_id int DEFAULT 1 -- ID of the current 'phrase of the day'
);

-- Table: dictionary
-- Stores words, translations, and learning content.
CREATE TABLE dictionary (
  id serial PRIMARY KEY,
  word text NOT NULL,
  translation text NOT NULL,
  example text,
  audio_url text, -- Optional if not using TTS
  is_rare boolean DEFAULT false
);

-- Table: user_progress
-- Stores SM-2 algorithm data for each word per user.
CREATE TABLE user_progress (
  user_id uuid REFERENCES profiles(id),
  word_id int REFERENCES dictionary(id),
  next_review timestamp DEFAULT NOW(),
  interval int DEFAULT 0,
  ease_factor float DEFAULT 2.5,
  PRIMARY KEY (user_id, word_id)
);

-- RLS Policies (Basic Setup - Allow authenticated users to read/write their own data)
alter table profiles enable row level security;
alter table dictionary enable row level security;
alter table user_progress enable row level security;

create policy "Users can view their own profile"
  on profiles for select
  using ( auth.uid() = id );

create policy "Users can update their own profile"
  on profiles for update
  using ( auth.uid() = id );

create policy "Dictionary is public read-only"
  on dictionary for select
  to authenticated
  using ( true );

create policy "Users can view their own progress"
  on user_progress for select
  using ( auth.uid() = user_id );

create policy "Users can insert/update their own progress"
  on user_progress for all
  using ( auth.uid() = user_id );
