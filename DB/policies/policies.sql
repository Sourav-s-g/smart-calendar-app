alter table profiles enable row level security;
alter table calendars enable row level security;
alter table calendar_members enable row level security;
alter table roles enable row level security;
alter table events enable row level security;


--------------------PROFILES------------------------
-- SELECT own profile
create policy "Profiles: user can view own profile"
on profiles
for select
using (auth.uid() = id);

-- UPDATE own profile
create policy "Profiles: user can update own profile"
on profiles
for update
using (auth.uid() = id);



------------------CALENDARS-----------------------

-- SELECT calendars
create policy "Calendars: user can view own or member calendars"
on calendars
for select
using (
    created_by = auth.uid() -- owner
    OR
    exists (
        select 1
        from calendar_members cm
        where cm.calendar_id = calendars.id
        and cm.user_id = auth.uid()
    )
);

--CREATE/INSERT calendars
create policy "Calendars: authenticated users can create"
on calendars
for insert
with check (auth.uid() = created_by);


-- UPDATE calendar
-- Only creator can update calendar metadata (including hierarchical calendar)
create policy "Calendars: owner can update or transfer ownership"
on calendars
for update
using (created_by = auth.uid())
with check (
    -- new owner must already be a member of the calendar
    exists (
        select 1
        from calendar_members cm
        where cm.calendar_id = calendars.id
        and cm.user_id = calendars.created_by
    )
);

-- DELETE calendars
create policy "Calendars: Only creator can delete calendar"
on calendars
for delete
using (created_by = auth.uid());



-------------------------ROLES-------------------------------

-- SELECT roles
create policy "Roles: members can view roles"
on roles
for select
using (
    exists (
        select 1
        from calendar_members cm
        join calendars c on c.id = roles.calendar_id
        where cm.user_id = auth.uid()
        and cm.calendar_id = roles.calendar_id
        and c.type = 'hierarchical'
    )
);

-- INSERT roles
create policy "Roles: only creator can create roles"
on roles
for insert
with check (
    exists (
        select 1
        from calendars c
        where c.id = roles.calendar_id
        and c.created_by = auth.uid()
        and c.type = 'hierarchical'
    )
);


--------------------CALENDAR MEMBERS-----------------------

-- SELECT members
create policy "Calendar_members: members can view membership"
on calendar_members
for select
using (
    user_id = auth.uid()
    OR
    exists (
        select 1
        from calendar_members cm
        where cm.calendar_id = calendar_members.calendar_id
        and cm.user_id = auth.uid()
    )
);

-- INSERT members
create policy "Calendar_members: creator can add members"
on calendar_members
for insert
with check (
    exists (
        select 1
        from calendars c
        where c.id = calendar_members.calendar_id
        and c.created_by = auth.uid()
    )
);

--DELETE members
create policy "Calendar_members: creator can remove members"
on calendar_members
for delete
using (
    exists (
        select 1
        from calendars c
        where c.id = calendar_members.calendar_id
        and c.created_by = auth.uid()
    )
    and user_id != (
        select created_by
        from calendars
        where id = calendar_members.calendar_id
    )
);

-----------------------EVENTS-----------------------------

-- SELECT events
create policy "Events: members can view events"
on events
for select
using (
    exists (
        select 1
        from calendar_members cm
        where cm.calendar_id = events.calendar_id
        and cm.user_id = auth.uid()
    )
);


-- INSERT events
create policy "Events: members can create events"
on events
for insert
with check (
    exists (
        select 1
        from calendar_members cm
        where cm.calendar_id = events.calendar_id
        and cm.user_id = auth.uid()
    )
);

-- UPDATE/DELETE events (hierarchical)
create policy "Hierarchical event update/delete"
on events
for update
using (
    created_by = auth.uid() -- always creator
    OR
    exists (
        select 1
        from calendar_members me
        join calendar_members creator
            on creator.user_id = events.created_by
            and creator.calendar_id = events.calendar_id
        join roles my_role on my_role.id = me.role_id
        join roles creator_role on creator_role.id = creator.role_id
        join calendars c on c.id = events.calendar_id
        where me.user_id = auth.uid()
        and me.calendar_id = events.calendar_id
        and c.type = 'hierarchical'
        and my_role.role_level > creator_role.role_level
    )
);

create policy "Events: hierarchical event delete"
on events
for delete
using (
    created_by = auth.uid()
    OR
    exists (
        select 1
        from calendar_members me
        join calendar_members creator
            on creator.user_id = events.created_by
            and creator.calendar_id = events.calendar_id
        join roles my_role on my_role.id = me.role_id
        join roles creator_role on creator_role.id = creator.role_id

        where me.user_id = auth.uid()
        and me.calendar_id = events.calendar_id
        and my_role.role_level > creator_role.role_level
    )
);


