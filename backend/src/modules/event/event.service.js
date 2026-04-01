import supabase from '../../config/supabaseClient.js';

// CREATE EVENT
export const createEvent = async (eventData) => {
  const { data, error } = await supabase
    .from('events')
    .insert([eventData])
    .select();

  if (error) throw error;
  return data;
};


// GET EVENTS BY CALENDAR
export const getEventsByCalendar = async (calendar_id) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('calendar_id', calendar_id);

  if (error) throw error;
  return data;
};


// UPDATE EVENT
export const updateEvent = async (id, userId, updates) => {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id)
    .eq('created_by', userId)
    .select();

  if (error) throw error;
  return data;
};


// DELETE EVENT
export const deleteEvent = async (id, userId) => {
  const { data, error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)
    .eq('created_by', userId);

  if (error) throw error;
  return data;
};