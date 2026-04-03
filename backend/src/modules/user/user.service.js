import supabase from '../../config/supabaseClient.js';

// Change 'getProfileByEmail' to 'findUserByEmail' to match your controller
export const findUserByEmail = async (email) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (error) throw error;
  return data;
};

// Ensure your register function is also exported
export const createUser = async ({ name, email, password }) => {
  // If using Supabase Auth:
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  });

  if (error) throw error;
  return data.user;
};

export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  
  // This returns the 'session' (which contains the access_token) and the 'user'
  return data; 
};

export const refreshToken = async (refresh_token) => {
  const { data, error } = await supabase.auth.refreshSession({ refresh_token });
  if (error) throw error;
  return data;
};

export const getUsers = async () => {
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) throw error;
  return data;
};

export const getUserById = async (id) => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};