# Row Level Security (RLS) Policies

This document explains how Row Level Security (RLS) is implemented in the database.
The goal is to ensure that users can only access data that belongs to them or calendars they are members of.

---

## Tables with RLS Enabled

RLS is enabled on the following tables:

* `profiles`
* `calendars`
* `calendar_members`
* `roles`
* `events`

---

# 1. Profiles

### What this protects

Users should only be able to see and edit their own profile.

### Policies

**User can view their own profile**

```sql
using (auth.uid() = id)
```

**User can update their own profile**

```sql
using (auth.uid() = id)
```

### Result

* A user **cannot see another user's profile**
* A user **cannot update another user's profile**

---

# 2. Calendars

A calendar belongs to a creator, but other users can become members of that calendar.

### SELECT Policy

Users can view a calendar if:

* They created the calendar
  **OR**
* They are a member of the calendar

```sql
created_by = auth.uid()
OR exists (
  select 1 from calendar_members
  where calendar_id = calendars.id
  and user_id = auth.uid()
)
```

---

### INSERT Policy

Only authenticated users can create calendars, and they must set themselves as the creator.

```sql
with check (auth.uid() = created_by)
```

---

### UPDATE Policy

Only the creator of the calendar can update it.

This includes:

* Changing the calendar name
* Changing the calendar type
* Transferring ownership

Ownership transfer is only allowed if the new owner is already a member of the calendar.

---

### DELETE Policy

Only the creator can delete a calendar.

```sql
using (created_by = auth.uid())
```

---

# 3. Roles (Hierarchical Calendars Only)

Roles are only used when a calendar is marked as `hierarchical`.

Examples:

* Admin
* Manager
* Member

Each role has a `role_level`. A higher level means more authority.

---

### SELECT Policy

Users can view roles only if:

* They are a member of the calendar
  **AND**
* The calendar is hierarchical

---

### INSERT Policy

Only the creator of a hierarchical calendar can create roles.

---

# 4. Calendar Members

This table controls who belongs to a calendar.

---

### SELECT Policy

A user can see membership if:

* They are looking at **their own membership**
  **OR**
* They are already a member of the calendar

---

### INSERT Policy

Only the calendar creator can add members.

---

### DELETE Policy

Only the calendar creator can remove members.

The creator **cannot remove themselves**.

---

# 5. Events

Events belong to a calendar, not directly to a user.

---

### SELECT Policy

Users can view events only if they are members of that calendar.

---

### INSERT Policy

Users can create events only if they are members of the calendar.

---

### UPDATE / DELETE Policies (Hierarchical Logic)

An event can be updated or deleted if:

1. The user **created the event**
   **OR**
2. The calendar is hierarchical **and**
   the user has a **higher role level** than the person who created the event

This allows:

* Admins to edit/delete events created by lower-level members
* Members to only edit their own events

---

# Summary

| Table            | Who Can Read                | Who Can Write                            |
| ---------------- | --------------------------- | ---------------------------------------- |
| profiles         | Only the owner              | Only the owner                           |
| calendars        | Owner + members             | Only the owner                           |
| calendar_members | Members                     | Only the owner                           |
| roles            | Members (hierarchical only) | Only the owner                           |
| events           | Members                     | Members (with hierarchical restrictions) |

---

# Security Goals Achieved

This setup guarantees:

* Users cannot access data from calendars they are not part of
* Only owners control membership
* Hierarchical calendars support role-based permissions
* Users can never modify another user's profile
* Admin-level users can manage lower-level users' events

---

If you update the schema later (new tables or permissions), update this file to keep the security rules easy to understand.
