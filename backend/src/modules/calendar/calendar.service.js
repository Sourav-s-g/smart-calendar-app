import supabase from '../../config/supabaseClient.js';

export const createCalendar = async ({ name, type, created_by }) => {
  const { data, error } = await supabase
    .from('calendars')
    .insert([{ name, type, created_by }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getCalendars = async (userId) => {
  const { data, error } = await supabase
    .from('calendars')
    .select('*')
    .eq('created_by', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const deleteCalendar = async (id, userId) => {
  const { data, error } = await supabase
    .from('calendars')
    .delete()
    .eq('id', id)
    .eq('created_by', userId)
    .select();

  if (error) throw error;
  return data;
};

export const getCalendarsByUser = async (userId) => {
  const { data, error } = await supabase
    .from('calendars')
    .select('*')
    .eq('created_by', userId);

  if (error) throw error;
  return data;
};