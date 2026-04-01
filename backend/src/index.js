import 'dotenv/config';
import path from 'path';
import express from 'express';

import userRoutes from './modules/user/user.routes.js';
import calendarRoutes from './modules/calendar/calendar.routes.js';
import eventRoutes from './modules/event/event.routes.js'

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes); 
app.use('/api/calendars', calendarRoutes);
app.use('/api/events', eventRoutes);

app.get('/', (req, res) => {
  res.send("API running 🚀");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});