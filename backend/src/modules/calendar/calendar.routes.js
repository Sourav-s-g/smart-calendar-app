import express from 'express';
import {
  createCalendar,
  getCalendars,
  deleteCalendar,
  getUserCalendars
} from './calendar.controller.js';

import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getCalendars);
router.post('/', protect, createCalendar);

router.get('/my-calendars', protect, getUserCalendars);

router.delete('/:id', protect, deleteCalendar);

export default router;