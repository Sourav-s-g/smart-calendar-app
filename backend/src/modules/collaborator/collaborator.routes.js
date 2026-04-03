import express from 'express';
import {
  inviteUser,
  acceptInvite,
  getCollaborators,
  updateCollaboratorRole,
} from './collaborator.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.post('/calendars/:calendar_id/invite', protect, inviteUser);

router.post('/invites/accept', protect, acceptInvite);

router.get('/calendars/:id/users', protect, getCollaborators);

router.patch('/collaborators/:id', protect, updateCollaboratorRole);

export default router;