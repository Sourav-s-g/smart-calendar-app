import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

console.log("Current Directory:", process.cwd());
console.log("Looking for .env at:", path.resolve(__dirname, '../../.env'));
console.log("JWT_SECRET Value:", process.env.JWT_SECRET);

import userRoutes from './modules/user/user.routes.js';
import calendarRoutes from './modules/calendar/calendar.routes.js';

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes); 
app.use('/api/calendars', calendarRoutes);

app.get('/', (req, res) => {
  res.send("API running 🚀");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});