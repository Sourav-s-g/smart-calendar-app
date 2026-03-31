import * as eventService from './event.service.js';

// CREATE EVENT
export const createEvent = async (req, res) => {
  try {
    const {
      calendar_id,
      title,
      description,
      location,
      location_url,
      start_time,
      end_time,
      event_status
    } = req.body;

    const created_by = req.user.id;

    const data = await eventService.createEvent({
      calendar_id,
      created_by,
      title,
      description,
      location,
      location_url,
      start_time,
      end_time,
      event_status
    });

    res.status(201).json({
      success: true,
      data
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};


// GET EVENTS BY CALENDAR
export const getEventsByCalendar = async (req, res) => {
  try {
    const { calendar_id } = req.params;

    const data = await eventService.getEventsByCalendar(calendar_id);

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// UPDATE EVENT
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const data = await eventService.updateEvent(id, userId, req.body);

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found or not owned by user"
      });
    }

    res.status(200).json({
      success: true,
      data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// DELETE EVENT
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const data = await eventService.deleteEvent(id, userId);

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found or not owned by user"
      });
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};