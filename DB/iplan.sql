create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz default now()
);

-- Enum types
create type calendar_type as enum ('personal', 'shared', 'hierarchical');
create type event_status as enum ('PENDING', 'APPROVED', 'REJECTED');

-- Calendars
create table calendars (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type calendar_type not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- Roles (only meaningful for hierarchical calendars)
create table roles (
  id uuid primary key default gen_random_uuid(),
  calendar_id uuid not null references calendars(id) on delete cascade,
  role_name text not null,
  role_level int not null,
  created_at timestamptz default now(),
  unique(calendar_id, role_name)
);

-- Calendar members
create table calendar_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  calendar_id uuid not null references calendars(id) on delete cascade,
  role_id uuid references roles(id) on delete set null, -- nullable for personal/shared
  joined_at timestamptz default now(),
  unique(user_id, calendar_id)
);

-- Events
create table events (
  id uuid primary key default gen_random_uuid(),
  calendar_id uuid not null references calendars(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  start_time timestamptz not null,
  end_time timestamptz not null,
  event_status event_status default 'PENDING',
  created_at timestamptz default now()
);


-- to insert values from auth.user to profiles directly

DO $$
DECLARE
    -- 1. Define the cursor to fetch from the auth schema
    user_cursor CURSOR FOR 
        SELECT id, email, created_at 
        FROM auth.users;
    
    user_record RECORD;
BEGIN
    -- 2. Open and loop through the cursor
    FOR user_record IN user_cursor LOOP
        BEGIN
            -- 3. Insert into your target table
            INSERT INTO public.users (id, email, name, created_at)
            VALUES (
                user_record.id, 
                user_record.email,
                -- Split email to create a default name (e.g., 'alice' from 'alice@example.com')
                split_part(user_record.email, '@', 1),
                user_record.created_at
            );
            
            RAISE NOTICE 'Inserted user: %', user_record.email;

        EXCEPTION 
            -- 4. Skip if the ID already exists in the target table
            WHEN unique_violation THEN
                RAISE NOTICE 'User % already exists, skipping...', user_record.email;
            WHEN OTHERS THEN
                RAISE WARNING 'Unexpected error for %: %', user_record.email, SQLERRM;
        END;
    END LOOP;
END $$;


insert into auth.users (id, email, aud, role) values
  ('00000000-0000-0000-0000-000000000011', 'user11@example.com', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000012', 'user12@example.com', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000013', 'user13@example.com', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000014', 'user14@example.com', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000015', 'user15@example.com', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000016', 'user16@example.com', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000017', 'user17@example.com', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000018', 'user18@example.com', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000019', 'user19@example.com', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000020', 'user20@example.com', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000021', 'user21@example.com', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000022', 'user22@example.com', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000023', 'user23@example.com', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000024', 'user24@example.com', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000025', 'user25@example.com', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000026', 'user26@example.com', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000027', 'user27@example.com', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000028', 'user28@example.com', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000029', 'user29@example.com', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000030', 'user30@example.com', 'authenticated', 'authenticated');

  insert into calendars (id, name, type, created_by) values
  (gen_random_uuid(), 'Liam Personal', 'personal', '00000000-0000-0000-0000-000000000011'),
  (gen_random_uuid(), 'Olivia Shared', 'shared', '00000000-0000-0000-0000-000000000012'),
  (gen_random_uuid(), 'Noah Project', 'shared', '00000000-0000-0000-0000-000000000013'),
  (gen_random_uuid(), 'Emma Work', 'hierarchical', '00000000-0000-0000-0000-000000000014'),
  (gen_random_uuid(), 'Oliver Gym', 'personal', '00000000-0000-0000-0000-000000000015'),
  (gen_random_uuid(), 'Ava Study', 'shared', '00000000-0000-0000-0000-000000000016'),
  (gen_random_uuid(), 'Elijah Tasks', 'personal', '00000000-0000-0000-0000-000000000017'),
  (gen_random_uuid(), 'Sophia Events', 'shared', '00000000-0000-0000-0000-000000000018'),
  (gen_random_uuid(), 'James Business', 'hierarchical', '00000000-0000-0000-0000-000000000019'),
  (gen_random_uuid(), 'Isabella Personal', 'personal', '00000000-0000-0000-0000-000000000020'),
  (gen_random_uuid(), 'William Dev', 'shared', '00000000-0000-0000-0000-000000000021'),
  (gen_random_uuid(), 'Mia Schedule', 'personal', '00000000-0000-0000-0000-000000000022'),
  (gen_random_uuid(), 'Benjamin Hier', 'hierarchical', '00000000-0000-0000-0000-000000000023'),
  (gen_random_uuid(), 'Charlotte Shared', 'shared', '00000000-0000-0000-0000-000000000024'),
  (gen_random_uuid(), 'Lucas Private', 'personal', '00000000-0000-0000-0000-000000000025'),
  (gen_random_uuid(), 'Amelia Team', 'shared', '00000000-0000-0000-0000-000000000026'),
  (gen_random_uuid(), 'Mason Internal', 'hierarchical', '00000000-0000-0000-0000-000000000027'),
  (gen_random_uuid(), 'Evelyn Life', 'personal', '00000000-0000-0000-0000-000000000028'),
  (gen_random_uuid(), 'Ethan Collab', 'shared', '00000000-0000-0000-0000-000000000029'),
  (gen_random_uuid(), 'Harper Work', 'hierarchical', '00000000-0000-0000-0000-000000000030');

-- Link them in calendar_members
insert into calendar_members (user_id, calendar_id)
select created_by, id from calendars;