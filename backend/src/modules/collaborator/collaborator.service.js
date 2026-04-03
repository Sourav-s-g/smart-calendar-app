import supabase from '../../config/supabaseClient.js';


export const inviteUser = async ({ calendarId, inviteeUserId, roleId = null }) => {
  
  // 1. Check if the calendar is personal before proceeding
  const { data: calendar, error: calError } = await supabase
    .from('calendars')
    .select('type')
    .eq('id', calendarId)
    .maybeSingle();

  if (calError || !calendar) throw new Error('Calendar not found');
  
  if (calendar.type === 'personal') {
    throw new Error('Cannot invite collaborators to a personal calendar');
  }

  // 2. Duplicate check
  const { data: existing } = await supabase
    .from('calendar_members')
    .select('id')
    .eq('calendar_id', calendarId)
    .eq('user_id', inviteeUserId)
    .maybeSingle();

  if (existing) throw new Error('User is already a member of this calendar');

  // 3. Perform the insert
  const { data, error } = await supabase
    .from('calendar_members')
    .insert([{ 
      calendar_id: calendarId, 
      user_id: inviteeUserId, 
      role_id: roleId 
    }])
    .select('id, joined_at, user_id, calendar_id, role_id')
    .single();

  if (error) throw error;
  return data;
};

export const acceptInvite = async ({ calendarId, userId }) => {
  const { data, error } = await supabase
    .from('calendar_members')
    .select('id, joined_at, calendar_id, user_id, role_id')
    .eq('calendar_id', calendarId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('No invite found for this user on this calendar');
  return data;
};

/**
 * List all collaborators of a calendar with their profile + role info.
 */
export const getCollaborators = async (calendarId) => {
  const { data, error } = await supabase
    .from('calendar_members')
    .select(`
      id,
      joined_at,
      role_id,
      profiles ( id, name ),
      roles    ( role_name, role_level )
    `)
    .eq('calendar_id', calendarId);

  if (error) throw error;
  return data;
};

/**
 * Update the role of a collaborator (calendar_members row).
 */
export const updateCollaboratorRole = async ({ memberId, roleId }) => {
  const { data, error } = await supabase
    .from('calendar_members')
    .update({ role_id: roleId })
    .eq('id', memberId)
    .select('id, user_id, calendar_id, role_id')
    .single();

  if (error) throw error;
  return data;
};