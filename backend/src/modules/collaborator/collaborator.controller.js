import * as collaboratorService from './collaborator.service.js';
import supabase from '../../config/supabaseClient.js';

// ─── Helper: Check Permissions and Calendar Type ─────────────────────────────
const checkCalendarPermissions = async (calendarId, userId) => {
  const { data, error } = await supabase
    .from('calendars')
    .select('created_by, type')
    .eq('id', calendarId)
    .maybeSingle();

  if (error || !data) {
    return { allowed: false, status: 404, message: 'Calendar not found' };
  }

  // Block actions if the calendar is personal
  if (data.type === 'personal') {
    return { 
      allowed: false, 
      status: 403, 
      message: 'Action not allowed: Personal calendars cannot have collaborators.' 
    };
  }

  // Block actions if the user isn't the owner
  if (data.created_by !== userId) {
    return { 
      allowed: false, 
      status: 403, 
      message: 'Only the calendar owner can perform this action.' 
    };
  }

  return { allowed: true };
};

// ─── POST /calendars/:id/invite ───────────────────────────────────────────────
export const inviteUser = async (req, res) => {
  try {
    const calendarId = req.params.calendar_id;
    const { email, role_id: roleId } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // ✅ CHECK: Is it personal? Is user the owner?
    const permission = await checkCalendarPermissions(calendarId, req.user.id);
    if (!permission.allowed) {
      return res.status(permission.status).json({
        success: false,
        message: permission.message,
      });
    }

    // Convert email → user_id
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (userError || !user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const data = await collaboratorService.inviteUser({
      calendarId,
      inviteeUserId: user.id,
      roleId: roleId || null,
    });

    res.status(201).json({ success: true, message: 'User invited successfully', data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── POST /invites/accept ─────────────────────────────────────────────────────
export const acceptInvite = async (req, res) => {
  try {
    const { calendar_id: calendarId } = req.body;
    if (!calendarId) {
      return res.status(400).json({ success: false, message: 'calendar_id is required' });
    }

    // ✅ Note: No ownership check here because the invitee isn't the owner,
    // but the service should ideally check if the calendar is still "personal" 
    // just in case it was changed mid-process.
    
    const data = await collaboratorService.acceptInvite({
      calendarId,
      userId: req.user.id,
    });

    res.json({ success: true, message: 'Invite accepted', data });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

// ─── GET /calendars/:id/users ─────────────────────────────────────────────────
export const getCollaborators = async (req, res) => {
  try {
    const calendarId = req.params.id;
    const data = await collaboratorService.getCollaborators(calendarId);
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── PATCH /collaborators/:id ─────────────────────────────────────────────────
export const updateCollaboratorRole = async (req, res) => {
  try {
    const memberId = req.params.id;
    const { role_id: roleId } = req.body;

    if (!roleId) {
      return res.status(400).json({ success: false, message: 'role_id is required' });
    }

    const { data: member } = await supabase
      .from('calendar_members')
      .select('calendar_id')
      .eq('id', memberId)
      .maybeSingle();

    if (!member) {
      return res.status(404).json({ success: false, message: 'Collaborator not found' });
    }

    // ✅ CHECK: Ensure the calendar isn't personal and user is owner
    const permission = await checkCalendarPermissions(member.calendar_id, req.user.id);
    if (!permission.allowed) {
      return res.status(permission.status).json({
        success: false,
        message: permission.message,
      });
    }

    const data = await collaboratorService.updateCollaboratorRole({ memberId, roleId });
    res.json({ success: true, message: 'Role updated successfully', data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};