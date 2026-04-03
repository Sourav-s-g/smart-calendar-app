import express from 'express';
import {
  createEvent,
  getEventsByCalendar,
  updateEvent,
  deleteEvent
} from './event.controller.js';

import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

// CREATE
router.post('/', protect, createEvent);

// GET BY CALENDAR
router.get('/calendar/:calendar_id', protect, getEventsByCalendar);

// UPDATE
router.put('/:id', protect, updateEvent);

// DELETE
router.delete('/:id', protect, deleteEvent);

export default router;


