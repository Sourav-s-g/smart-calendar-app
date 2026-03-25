import express from 'express';
import supabase from './supabaseClient.js';

const app = express();
app.use(express.json());

app.set('json spaces', 2);

app.get('/profiles', async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');

  if (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }

  res.json({
    success: true,
    count: data.length,
    data: data
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});